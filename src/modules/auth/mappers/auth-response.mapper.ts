import { Injectable } from '@nestjs/common';
import { LoginResponseDto } from '../dtos/LoginResponse.dto';
import { RegisterResponseDto } from '../dtos/RegisterResponse.dto';

@Injectable()
export class AuthResponseMapper {
  public toLoginResponse(
    token: string,
    userId: string,
    cartId: string | null,
  ): LoginResponseDto {
    return new LoginResponseDto(token, userId, cartId);
  }

  public toRegisterResponse(
    token: string,
    userId: string,
    cartId: string | null,
    message: string,
  ): RegisterResponseDto {
    return new RegisterResponseDto(token, userId, cartId, message);
  }
}
