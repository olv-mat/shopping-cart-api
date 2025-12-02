import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { UserResponseDto } from '../dtos/UserResponse.dto';
import { UserEntity } from '../entities/user.entity';

export class UserResponseMapper {
  public static toResponseOne = this.toDto;
  public static toResponseMany = this.toDtoList;

  public static toDto(
    userEntity: UserEntity,
    cartEntity: CartEntity | null = null,
  ): UserResponseDto {
    const { id, name, email } = userEntity;
    const cartId = cartEntity ? cartEntity.id : null;
    return new UserResponseDto(id, cartId, name, email);
  }

  private static toDtoList(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => this.toDto(user));
  }
}
