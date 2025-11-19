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
import { UserEntity } from '../user/entities/user.entity';
import { UserRoles } from '../user/enums/user-roles.enum';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';

/* 
  npm install bcrypt
  npm install --D @types/bcrypt 
*/

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(
    dto: RegisterDto,
    admin: boolean,
  ): Promise<{ user: UserEntity; token: string }> {
    await this.checkUserExists(dto.email);
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save({
      ...dto,
      password: passwordHash,
      ...(admin && { role: UserRoles.ADMIN }),
    });
    const token = this.generateToken(user);
    return { user, token };
  }

  public async login(
    dto: LoginDto,
  ): Promise<{ user: UserEntity; token: string }> {
    const user = await this.findUserByEmail(dto.email);
    const validPassword = await bcrypt.compare(dto.password, user.password);

    if (!validPassword) throw new UnauthorizedException('Invalid password');

    const token = this.generateToken(user);
    return { user, token };
  }

  private async checkUserExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) throw new ConflictException('User already exists');
  }

  private async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
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
