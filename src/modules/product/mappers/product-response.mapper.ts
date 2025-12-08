import { CategoryResponseMapper } from 'src/modules/category/mappers/category-response.mapper';
import { ProductResponseDto } from '../dtos/ProductResponse.dto';
import { ProductEntity } from '../entities/product.entity';

export class ProductResponseMapper {
  public static toResponseMany = (productEntities: ProductEntity[]) =>
    this.toDtoList(productEntities);
  public static toResponseOne = (productEntity: ProductEntity) =>
    this.toDto(productEntity);

  private static toDtoList(products: ProductEntity[]): ProductResponseDto[] {
    return products.map((product) => this.toDto(product));
  }

  public static toDto(product: ProductEntity): ProductResponseDto {
    const category = CategoryResponseMapper.toDto(product.category);
    return new ProductResponseDto(
      product.id,
      product.product,
      category,
      product.price,
    );
  }
}
