import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { CategoryExists } from '../validators/category-exists.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { dtoProperties } from 'src/common/utils/swagger-properties';

export class CreateProductDto {
  @ApiProperty(dtoProperties.productName)
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'product cannot contain only spaces' })
  product: string;

  @ApiProperty(dtoProperties.categoryId)
  @IsNotEmpty()
  @CategoryExists({ message: 'this category does not exist' })
  category: string;

  @ApiProperty(dtoProperties.price)
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'price cannot contain only spaces' })
  price: string;
}
