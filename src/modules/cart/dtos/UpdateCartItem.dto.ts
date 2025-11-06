import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsUUID, Min } from 'class-validator';
import {
  swaggerDescriptions,
  swaggerExamples,
} from 'src/common/utils/swagger-properties';

export class UpdateCartItemDto {
  @ApiProperty({
    description: swaggerDescriptions.productId,
    example: swaggerExamples.productId,
  })
  @IsUUID()
  product: string;

  @ApiProperty({
    description: swaggerDescriptions.quantity,
    example: swaggerExamples.quantity,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
