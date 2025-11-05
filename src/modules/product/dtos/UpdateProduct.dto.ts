import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { CategoryExists } from '../validators/category-exists.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  swaggerDescriptions,
  swaggerExamples,
} from 'src/common/utils/swagger-properties';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: swaggerDescriptions.product,
    example: swaggerExamples.product,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'product cannot contain only spaces' })
  product?: string;

  @ApiPropertyOptional({
    description: swaggerDescriptions.category,
    example: swaggerExamples.category,
  })
  @IsOptional()
  @IsNotEmpty()
  @CategoryExists({ message: 'this category does not exist' })
  category?: string;

  @ApiPropertyOptional({
    description: swaggerExamples.price,
    example: swaggerExamples.price,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'price cannot contain only spaces' })
  price?: string;
}
