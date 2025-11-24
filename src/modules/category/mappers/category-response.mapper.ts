import { CategoryResponseDto } from '../dtos/CategoryResponse.dto';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryResponseMapper {
  public static toResponseOne = this.toDto;
  public static toResponseMany = this.toDtoList;

  public static toDto(category: CategoryEntity): CategoryResponseDto {
    return new CategoryResponseDto(category.id, category.category);
  }

  private static toDtoList(
    categories: CategoryEntity[],
  ): CategoryResponseDto[] {
    return categories.map((category) => this.toDto(category));
  }
}
