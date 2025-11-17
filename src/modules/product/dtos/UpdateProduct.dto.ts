import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  CategoryIdProperty,
  PriceProperty,
  ProductNameProperty,
} from 'src/common/swagger/properties.swagger';
import { CategoryExists } from '../validators/category-exists.decorator';

export class UpdateProductDto {
  @ProductNameProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'product cannot contain only spaces' })
  product?: string;

  @CategoryIdProperty()
  @IsOptional()
  @IsNotEmpty()
  @CategoryExists({ message: 'this category does not exist' })
  category?: string;

  @PriceProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'price cannot contain only spaces' })
  price?: string;
}
