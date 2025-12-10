import { OrderResponseMapper } from 'src/modules/order/mappers/order-response.mapper';
import { UserResponseMapper } from 'src/modules/user/mappers/user-response.mapper';
import { CartResponseDto } from '../dtos/CartResponse.dto';
import { CartEntity } from '../entities/cart.entity';
import { CartItemResponseMapper } from './cart-item-response.mapper';

export class CartResponseMapper {
  public static toResponseMany = (cartEntities: CartEntity[]) =>
    this.toDtoList(cartEntities);

  public static toResponseOne = (cartEntity: CartEntity) =>
    this.toDto(cartEntity);

  private static toDtoList(cartEntities: CartEntity[]): CartResponseDto[] {
    return cartEntities.map((cartEntity) => this.toDto(cartEntity));
  }

  public static toDto(cartEntity: CartEntity): CartResponseDto {
    const { id, status } = cartEntity;
    return new CartResponseDto(
      id,
      UserResponseMapper.toDto(cartEntity.user),
      status,
      CartItemResponseMapper.toDtoList(cartEntity.items),
      cartEntity.order ? OrderResponseMapper.toDto(cartEntity.order) : null,
    );
  }
}
