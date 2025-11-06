import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { CategoryExists } from '../validators/category-exists.decorator';
import { ApiProperty } from '@nestjs/swagger';
import {
  swaggerDescriptions,
  swaggerExamples,
} from 'src/common/utils/swagger-properties';

export class CreateProductDto {
  @ApiProperty({
    description: swaggerDescriptions.productName,
    example: swaggerExamples.productName,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'product cannot contain only spaces' })
  product: string;

  @ApiProperty({
    description: swaggerDescriptions.categoryId,
    example: swaggerExamples.categoryId,
  })
  @IsNotEmpty()
  @CategoryExists({ message: 'this category does not exist' })
  category: string;

  @ApiProperty({
    description: swaggerDescriptions.price,
    example: swaggerExamples.price,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'price cannot contain only spaces' })
  price: string;
}
