import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';
import { RegisterDto } from '../common/dto/register.dto';
import { Register } from '../common/entity/register.entity';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authenticationService.login(loginDto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() registerDto: RegisterDto): Promise<Partial<Register>> {
    return this.authenticationService.register(registerDto);
  }

  @Post('update-password')
  @UsePipes(new ValidationPipe())
  updatePassword(
    @Body('email') email: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    return this.authenticationService.updatePassword(
      email,
      oldPassword,
      newPassword,
    );
  }

  @Post('forgot-password')
  @UsePipes(new ValidationPipe())
  forgotPassword(@Body('email') email: string): Promise<{ message: string }> {
    return this.authenticationService.forgotPassword(email);
  }

  @Get('all-users')
  @UsePipes(new ValidationPipe())
  getAllUsers(): Promise<LoginDto[]> {
    return this.authenticationService.getAllUsers();
  }
}
