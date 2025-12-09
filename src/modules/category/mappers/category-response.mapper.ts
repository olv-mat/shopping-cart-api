import { CategoryResponseDto } from '../dtos/CategoryResponse.dto';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryResponseMapper {
  public static toResponseMany = (categoryEntities: CategoryEntity[]) =>
    this.toDtoList(categoryEntities);

  public static toResponseOne = (categoryEntity: CategoryEntity) =>
    this.toDto(categoryEntity);

  private static toDtoList(
    categoryEntities: CategoryEntity[],
  ): CategoryResponseDto[] {
    return categoryEntities.map((categoryEntity) => this.toDto(categoryEntity));
  }

  public static toDto(categoryEntity: CategoryEntity): CategoryResponseDto {
    return new CategoryResponseDto(categoryEntity.id, categoryEntity.category);
  }
}
