import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { dtoProperties } from 'src/common/utils/swagger-properties';

export class UpdateUserDto {
  @ApiPropertyOptional(dtoProperties.name)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'name cannot contain only spaces' })
  name?: string;

  @ApiPropertyOptional(dtoProperties.email)
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Matches(/\S/, { message: 'email cannot contain only spaces' })
  email?: string;

  @ApiPropertyOptional(dtoProperties.password)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;
}
