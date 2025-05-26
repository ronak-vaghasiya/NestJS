import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.forgotPassword(body.email);
  }

  @Post('update-password')
  async updatePassword(
    @Body()
    body: {
      email: string;
      currentPassword: string;
      newPassword: string;
    },
  ) {
    if (!body.email || !body.currentPassword || !body.newPassword) {
      throw new BadRequestException(
        'Email, current password, and new password are required',
      );
    }
    return this.authService.updatePassword(
      body.email,
      body.currentPassword,
      body.newPassword,
    );
  }
}
