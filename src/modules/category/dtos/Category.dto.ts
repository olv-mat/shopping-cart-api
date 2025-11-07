import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { dtoProperties } from 'src/common/utils/swagger-properties';

// npm install class-validator class-transformer

export class CategoryDto {
  @ApiProperty(dtoProperties.categoryName)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: 'category cannot contain only spaces' })
  category: string;
}
