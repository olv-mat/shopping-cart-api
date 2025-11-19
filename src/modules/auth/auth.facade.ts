import { Injectable } from '@nestjs/common';
import { CartService } from '../cart/services/cart.service';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/AuthResponse.dto';
import { LoginDto } from './dtos/Login.dto';
import { RegisterDto } from './dtos/Register.dto';
import { AuthMapper } from './mappers/auth.mapper';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService,
  ) {}

  public async register(
    dto: RegisterDto,
    admin: boolean,
  ): Promise<AuthResponseDto> {
    const { user, token } = await this.authService.register(dto, admin);
    if (!admin) await this.cartService.createCart(user);
    return AuthMapper.toResponse(user.id, token);
  }

  public async login(dto: LoginDto): Promise<AuthResponseDto> {
    const { user, token } = await this.authService.login(dto);
    return AuthMapper.toResponse(user.id, token);
  }
}
