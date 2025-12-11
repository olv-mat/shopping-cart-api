import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
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
  public readonly name: string;

  @EmailProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Matches(/\S/, { message: 'email cannot contain only spaces' })
  public readonly email: string;

  @PasswordProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsStrongPassword()
  public readonly password: string;
}
