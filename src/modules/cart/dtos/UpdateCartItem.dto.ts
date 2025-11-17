import { IsInt, IsUUID, Min } from 'class-validator';
import {
  ProductIdProperty,
  QuantityProperty,
} from 'src/common/swagger/properties.swagger';

export class UpdateCartItemDto {
  @ProductIdProperty()
  @IsUUID()
  product: string;

  @QuantityProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}
