import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  EmailProperty,
  PasswordProperty,
} from 'src/common/swagger/properties.swagger';

export class LoginDto {
  @EmailProperty()
  @IsNotEmpty()
  @IsEmail()
  @Matches(/\S/, { message: 'email cannot contain only spaces' })
  public readonly email: string;

  @PasswordProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: 'password cannot contain only spaces' })
  public readonly password: string;
}
