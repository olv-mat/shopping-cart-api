import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  swaggerDescriptions,
  swaggerExamples,
} from 'src/common/utils/swagger-properties';

export class LoginDto {
  @ApiProperty({
    description: swaggerDescriptions.email,
    example: swaggerExamples.email,
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/\S/, { message: 'email cannot contain only spaces' })
  email: string;

  @ApiProperty({
    description: swaggerDescriptions.password,
    example: swaggerExamples.password,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'password cannot contain only spaces' })
  password: string;
}
