import {
  Length,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class SignupUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(5, 20)
  password: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @Length(2, 200)
  about: string;
}

/*
  Для регистрации нужно указать почту, пароль, 
  имя пользователя и по желанию — аватар и описание профиля. 
  Для авторизации достаточно имени пользователя и пароля.
*/
