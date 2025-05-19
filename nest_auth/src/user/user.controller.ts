import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    return this.userService.create(email, password);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return {
      message: 'User deleted successfully',
    };
  }

  @Post('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    if (!body.newPassword) {
      throw new BadRequestException('New password is required');
    }

    const hashedPassword = await this.userService.hashPassword(
      body.newPassword,
    );
    await this.userService.updatePassword(id, hashedPassword);
    return {
      message: 'Password updated successfully',
    };
  }
}
