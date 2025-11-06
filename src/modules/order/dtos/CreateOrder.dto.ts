import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import {
  swaggerDescriptions,
  swaggerExamples,
} from 'src/common/utils/swagger-properties';

export class CreateOrderDto {
  @ApiProperty({
    description: swaggerDescriptions.cartId,
    example: swaggerExamples.cartId,
  })
  @IsUUID()
  cart: string;
}
