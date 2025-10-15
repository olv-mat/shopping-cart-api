import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

// npm install class-validator class-transformer

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: 'category cannot contain only spaces' })
  category: string;
}
