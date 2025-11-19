import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UuidDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  uuid: string;
}
