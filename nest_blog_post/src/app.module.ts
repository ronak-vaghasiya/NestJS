import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/post.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/comment.entity';
import { LikesModule } from './likes/likes.module';
import { Like } from './likes/like.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Post, Comment, Like],
        synchronize: configService.get<boolean>('DB_SYNC', true),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
  ],
})
export class AppModule {}
