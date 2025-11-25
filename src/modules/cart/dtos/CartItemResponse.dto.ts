import { ProductResponseDto } from 'src/modules/product/dtos/ProductResponse.dto';

export class CartItemResponseDto {
  public readonly product: ProductResponseDto;
  public readonly quantity: number;

  constructor(product: ProductResponseDto, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }
}
