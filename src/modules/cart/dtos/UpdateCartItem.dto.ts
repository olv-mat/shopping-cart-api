import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';
import { dtoProperties } from 'src/common/utils/swagger-properties';

export class UpdateCartItemDto {
  @ApiProperty(dtoProperties.productId)
  @IsUUID()
  product: string;

  @ApiProperty(dtoProperties.quantity)
  @IsInt()
  @Min(1)
  quantity: number;
}
