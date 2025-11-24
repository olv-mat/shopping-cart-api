import { CategoryResponseDto } from 'src/modules/category/dtos/CategoryResponse.dto';

export class ProductResponseDto {
  public readonly id: string;
  public readonly product: string;
  public readonly category: CategoryResponseDto;
  public readonly price: string;

  constructor(
    id: string,
    product: string,
    category: CategoryResponseDto,
    price: string,
  ) {
    this.id = id;
    this.product = product;
    this.category = category;
    this.price = price;
  }
}
