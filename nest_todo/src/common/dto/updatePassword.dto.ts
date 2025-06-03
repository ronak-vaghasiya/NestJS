import { IsEmail, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
