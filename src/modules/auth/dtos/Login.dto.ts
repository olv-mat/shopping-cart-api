import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { dtoProperties } from 'src/common/utils/swagger-properties';

export class LoginDto {
  @ApiProperty(dtoProperties.email)
  @IsNotEmpty()
  @IsEmail()
  @Matches(/\S/, { message: 'email cannot contain only spaces' })
  email: string;

  @ApiProperty(dtoProperties.password)
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'password cannot contain only spaces' })
  password: string;
}
