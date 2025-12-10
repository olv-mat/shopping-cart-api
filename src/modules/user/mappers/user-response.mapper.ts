import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { UserResponseDto } from '../dtos/UserResponse.dto';
import { UserEntity } from '../entities/user.entity';

export class UserResponseMapper {
  public static toResponseMany = (userEntities: UserEntity[]) =>
    this.toDtoList(userEntities);

  public static toResponseOne = (
    userEntity: UserEntity,
    cartEntity: CartEntity | null = null,
  ) => this.toDto(userEntity, cartEntity);

  private static toDtoList(userEntities: UserEntity[]): UserResponseDto[] {
    return userEntities.map((userEntity) => this.toDto(userEntity));
  }

  public static toDto(
    userEntity: UserEntity,
    cartEntity: CartEntity | null = null,
  ): UserResponseDto {
    const { id, name, email } = userEntity;
    const cart = cartEntity ? cartEntity.id : null;
    return new UserResponseDto(id, cart, name, email);
  }
}
