import { IsUUID } from 'class-validator';
import { CartIdProperty } from 'src/common/settings/swagger/swagger.properties';

export class CreateOrderDto {
  @CartIdProperty()
  @IsUUID()
  public readonly cart: string;
}
