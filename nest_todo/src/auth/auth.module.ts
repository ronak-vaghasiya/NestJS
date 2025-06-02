import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Register } from '../common/entity/register.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Register])],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
