import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import {
  CategoryIdProperty,
  PriceProperty,
  ProductNameProperty,
} from 'src/common/swagger/properties.swagger';
import { CategoryExists } from '../validators/category-exists.decorator';

export class CreateProductDto {
  @ProductNameProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'product cannot contain only spaces' })
  public readonly product: string;

  @CategoryIdProperty()
  @IsNotEmpty()
  @CategoryExists({ message: 'this category does not exist' })
  public readonly category: string;

  @PriceProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'price cannot contain only spaces' })
  public readonly price: string;
}
