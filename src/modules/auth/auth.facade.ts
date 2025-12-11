import { Injectable } from '@nestjs/common';
import { CartService } from '../cart/services/cart.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';
import { AuthMapper } from './mappers/auth.mapper';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
  ) {}

  public async register(
    dto: RegisterDto,
    admin: boolean,
  ): Promise<AuthResponseDto> {
    const userEntity = await this.userService.create(dto, admin);
    const token = this.authService.generateToken(userEntity);
    if (!admin) await this.cartService.create(userEntity);
    return AuthMapper.toResponse(userEntity.id, token);
  }

  public async login(dto: LoginDto): Promise<AuthResponseDto> {
    const userEntity = await this.userService.getUserByEmail(dto.email);
    const token = await this.authService.authenticate(dto.password, userEntity);
    return AuthMapper.toResponse(userEntity.id, token);
  }
}
