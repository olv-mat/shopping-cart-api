import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EmailProperty,
  NameProperty,
  PasswordProperty,
} from 'src/common/swagger/properties.swagger';

export class RegisterDto {
  @NameProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'name cannot contain only spaces' })
  name: string;

  @EmailProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Matches(/\S/, { message: 'email cannot contain only spaces' })
  email: string;

  @PasswordProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
