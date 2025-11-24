import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  EmailProperty,
  NameProperty,
  PasswordProperty,
} from 'src/common/swagger/properties.swagger';

export class UpdateUserDto {
  @NameProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(/\S/, { message: 'name cannot contain only spaces' })
  public readonly name?: string;

  @EmailProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Matches(/\S/, { message: 'email cannot contain only spaces' })
  public readonly email?: string;

  @PasswordProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsStrongPassword()
  public readonly password?: string;
}
