import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Repository } from 'typeorm';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartService } from '../cart/services/cart.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserRoles } from '../user/enums/user-roles.enum';
import { LoginDto } from './dtos/Login.dto';
import { LoginResponseDto } from './dtos/LoginResponse.dto';
import { RegisterDto } from './dtos/Register.dto';
import { RegisterResponseDto } from './dtos/RegisterResponse.dto';
import { AuthResponseMapper } from './mappers/auth-response.mapper';

/* 
  npm install bcrypt
  npm install --D @types/bcrypt 
*/

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly authResponseMapper: AuthResponseMapper,
    private readonly cartService: CartService,
  ) {}

  public async register(
    dto: RegisterDto,
    admin: boolean,
  ): Promise<RegisterResponseDto> {
    await this.checkUserExists(dto.email);
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save({
      ...dto,
      password: hashedPassword,
      ...(admin && { role: UserRoles.ADMIN }),
    });
    const cart = admin ? null : await this.cartService.createCart(user);
    const token = this.generateToken(user);

    return this.authResponseMapper.toRegisterResponse(
      token,
      user.id,
      cart?.id ?? null,
      'User created successfully',
    );
  }

  public async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.findUserByEmail(dto.email);
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.generateToken(user);
    let cart: CartEntity | null = null;
    if (user.role === UserRoles.CUSTOMER) {
      cart = await this.cartService.findActiveCartByUser(user);
    }
    return this.authResponseMapper.toLoginResponse(
      token,
      user.id,
      cart?.id ?? null,
    );
  }

  private async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private async checkUserExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new ConflictException('User already exists');
    }
  }

  private generateToken(user: UserEntity): string {
    const payload: UserInterface = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
