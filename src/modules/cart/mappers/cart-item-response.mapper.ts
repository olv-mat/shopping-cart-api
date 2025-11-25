import { ProductResponseMapper } from 'src/modules/product/mappers/product-response.mapper';
import { CartItemResponseDto } from '../dtos/CartItemResponse.dto';
import { CartItemEntity } from '../entities/cart-item.entity';

export class CartItemResponseMapper {
  public static toDto(cartItem: CartItemEntity): CartItemResponseDto {
    const product = ProductResponseMapper.toDto(cartItem.product);
    return new CartItemResponseDto(product, cartItem.quantity);
  }

  public static toDtoList(cartItems: CartItemEntity[]): CartItemResponseDto[] {
    return cartItems.map((item) => this.toDto(item));
  }
}
