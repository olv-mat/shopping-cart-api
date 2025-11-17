import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { CategoryNameProperty } from 'src/common/swagger/properties.swagger';

// npm install class-validator class-transformer

export class CategoryDto {
  @CategoryNameProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: 'category cannot contain only spaces' })
  category: string;
}
