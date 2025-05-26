import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { Register } from './common/entity/register.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'your-username'),
        password: configService.get<string>(
          'DATABASE_PASSWORD',
          'your-password',
        ),
        database: configService.get<string>('DATABASE_NAME', 'your-database'),
        entities: [Register],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
  ],
})
export class AppModule {}
