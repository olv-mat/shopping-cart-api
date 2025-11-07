import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { dtoProperties } from 'src/common/utils/swagger-properties';

export class CreateOrderDto {
  @ApiProperty(dtoProperties.cartId)
  @IsUUID()
  cart: string;
}
