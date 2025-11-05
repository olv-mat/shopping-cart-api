import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { CategoryExists } from '../validators/category-exists.decorator';
import { ApiProperty } from '@nestjs/swagger';
import {
  swaggerDescriptions,
  swaggerExamples,
} from 'src/common/utils/swagger-properties';

export class CreateProductDto {
  @ApiProperty({
    description: swaggerDescriptions.product,
    example: swaggerExamples.product,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'product cannot contain only spaces' })
  product: string;

  @ApiProperty({
    description: swaggerDescriptions.category,
    example: swaggerExamples.category,
  })
  @IsNotEmpty()
  @CategoryExists({ message: 'this category does not exist' })
  category: string;

  @ApiProperty({
    description: swaggerExamples.price,
    example: swaggerExamples.price,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'price cannot contain only spaces' })
  price: string;
}
