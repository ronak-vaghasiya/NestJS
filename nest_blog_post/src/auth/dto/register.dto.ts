import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  username: string;

  @MinLength(6)
  @IsString()
  password: string;
}
