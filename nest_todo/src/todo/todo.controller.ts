import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from '../common/dto/create.todo.dto';
import { UpdateTodoDto } from '../common/dto/update.todo.dto';
import { FilterTodosDto } from 'src/common/dto/filterTodos.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(createTodoDto);
  }

  @Post('all')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getFilteredTodos(@Body() filters: FilterTodosDto) {
    return this.todoService.getAllTodos(filters);
  }

  @Get('/:id')
  getTodo(@Param('id', ParseUUIDPipe) id: string) {
    return this.todoService.getTodo(id);
  }

  @Put('/update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo({ ...updateTodoDto, id });
  }

  @Delete('/delete/:id')
  deleteTodo(@Param('id', ParseUUIDPipe) id: string) {
    return this.todoService.deleteTodo(id);
  }
}
