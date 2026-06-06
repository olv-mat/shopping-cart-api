import { IsInt, IsUUID, Min } from 'class-validator';
import {
  ProductIdProperty,
  QuantityProperty,
} from 'src/common/settings/swagger/swagger.properties';

export class UpdateCartItemDto {
  @ProductIdProperty()
  @IsUUID()
  public readonly product: string;

  @QuantityProperty()
  @IsInt()
  @Min(1)
  public readonly quantity: number;
}
