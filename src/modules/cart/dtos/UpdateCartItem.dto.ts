import { IsInt, IsPositive, IsUUID, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsUUID()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
