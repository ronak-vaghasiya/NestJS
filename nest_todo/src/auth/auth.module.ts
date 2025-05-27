import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Register } from '../common/entity/register.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([Register]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
