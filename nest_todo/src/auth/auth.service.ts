import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../common/dto/register.dto';
import { LoginDto } from '../common/dto/login.dto';
import { Register } from '../common/entity/register.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Register)
    private readonly userRepository: Repository<Register>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Partial<Register>> {
    const { email, password, username, profilePicture } = registerDto;

    // Check if email or username already exists
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException(
        'Email already exists, please use another one',
      );
    }
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException(
        'Username already exists, please use another one',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user: Register = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      username,
      profilePicture,
    };

    // Save to database
    const savedUser = await this.userRepository.save(user);

    // Return response without password
    return {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      profilePicture: savedUser.profilePicture,
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(
        'User not found with this email, please register',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Entered password is incorrect, please try again',
      );
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(
        'User not found with this email, please register',
      );
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Entered old password is incorrect, please try again',
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(
    email: string,
  ): Promise<{ message: string; resetToken: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        'If an account exists, a reset link will be sent',
      );
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { email, userId: user.id },
      { expiresIn: '1h' },
    );

    return { message: 'Reset token generated successfully', resetToken };
  }

  async getAllUsers(): Promise<LoginDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      profilePicture: user.profilePicture,
    }));
  }
}
