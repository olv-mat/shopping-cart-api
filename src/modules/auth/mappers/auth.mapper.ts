import { AuthResponseDto } from '../dtos/AuthResponse.dto';

export class AuthMapper {
  public static toResponse(sub: string, token: string) {
    return new AuthResponseDto(sub, token);
  }
}
