import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';
import { RegisterDto } from '../common/dto/register.dto';
import { Register } from '../common/entity/register.entity';
import { UpdatePasswordDto } from 'src/common/dto/updatePassword.dto';
import { ForgotPasswordDto } from 'src/common/dto/forgotPassword.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string | null; refereshToken: string | null }> {
    return this.authenticationService.login(loginDto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(@Body() registerDto: RegisterDto): Promise<Partial<Register>> {
    return this.authenticationService.register(registerDto);
  }

  @Post('update-password')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updatePassword(
    @Body() body: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { email, oldPassword, newPassword } = body;
    return this.authenticationService.updatePassword(
      email,
      oldPassword,
      newPassword,
    );
  }

  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  forgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authenticationService.forgotPassword(body.email);
  }

  @Get('all-users')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  getAllUsers(): Promise<LoginDto[]> {
    return this.authenticationService.getAllUsers();
  }

  @Delete('delete-user/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.authenticationService.deleteUser(id);
  }
}
