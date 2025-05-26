import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { AuthenticationMiddleware } from 'src/authentication/authentication.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../common/entity/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('todo');
  }
}
