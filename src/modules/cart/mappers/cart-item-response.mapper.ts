import { ProductResponseMapper } from 'src/modules/product/mappers/product-response.mapper';
import { CartItemResponseDto } from '../dtos/CartItemResponse.dto';
import { CartItemEntity } from '../entities/cart-item.entity';

export class CartItemResponseMapper {
  public static toDtoList(
    cartItemEntities: CartItemEntity[],
  ): CartItemResponseDto[] {
    return cartItemEntities.map((cartItemEntity) => this.toDto(cartItemEntity));
  }

  public static toDto(cartItemEntity: CartItemEntity): CartItemResponseDto {
    return new CartItemResponseDto(
      ProductResponseMapper.toDto(cartItemEntity.product),
      cartItemEntity.quantity,
    );
  }
}
