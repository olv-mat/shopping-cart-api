import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { CategoryExists } from '../validators/category-exists.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { dtoProperties } from 'src/common/utils/swagger-properties';

export class UpdateProductDto {
  @ApiPropertyOptional(dtoProperties.name)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'product cannot contain only spaces' })
  product?: string;

  @ApiPropertyOptional(dtoProperties.categoryId)
  @IsOptional()
  @IsNotEmpty()
  @CategoryExists({ message: 'this category does not exist' })
  category?: string;

  @ApiPropertyOptional(dtoProperties.price)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'price cannot contain only spaces' })
  price?: string;
}
