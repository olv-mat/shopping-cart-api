import { UserResponseMapper } from 'src/modules/user/mappers/user-response.mapper';
import { CartResponseDto } from '../dtos/CartResponse.dto';
import { CartEntity } from '../entities/cart.entity';
import { CartItemResponseMapper } from './cart-item-response.mapper';

export class CartResponseMapper {
  public static toResponseOne = this.toDto;
  public static toResponseMany = this.toDtoList;

  public static toDto(cart: CartEntity): CartResponseDto {
    const { id, status } = cart;
    const user = UserResponseMapper.toDto(cart.user);
    const items = CartItemResponseMapper.toDtoList(cart.items);
    return new CartResponseDto(id, user, status, items);
  }

  public static toDtoList(carts: CartEntity[]): CartResponseDto[] {
    return carts.map((cart) => this.toDto(cart));
  }
}
