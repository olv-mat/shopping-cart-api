import { IsInt, IsUUID, Min } from 'class-validator';
import {
  ProductIdProperty,
  QuantityProperty,
} from 'src/common/swagger/properties.swagger';

export class UpdateCartItemDto {
  @ProductIdProperty()
  @IsUUID()
  public readonly product: string;

  @QuantityProperty()
  @IsInt()
  @Min(1)
  public readonly quantity: number;
}
