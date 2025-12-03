import { IsUUID } from 'class-validator';
import { CartIdProperty } from 'src/common/swagger/properties.swagger';

export class CreateOrderDto {
  @CartIdProperty()
  @IsUUID()
  public readonly cart: string;
}
