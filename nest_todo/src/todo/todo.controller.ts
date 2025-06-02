import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from '../common/dto/create.todo.dto';
import { UpdateTodoDto } from '../common/dto/update.todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(createTodoDto);
  }

  @Post('all')
  getFilteredTodos(@Body() filters: any) {
    return this.todoService.getAllTodos({
      page: Number(filters.page) || 1,
      perPage: Number(filters.perPage) || 10,
      title: filters.title,
      assignedTo: filters.assignedTo,
      status: filters.status,
      priority: filters.priority,
      tags: Array.isArray(filters.tags)
        ? filters.tags
        : typeof filters.tags === 'string'
          ? filters.tags.split(',')
          : undefined,
    });
  }

  @Get('/:id')
  getTodo(@Param('id') id: string) {
    return this.todoService.getTodo(id);
  }

  @Put('/update/:id')
  updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.updateTodo({ ...updateTodoDto, id });
  }

  @Delete('/delete/:id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodo(id);
  }
}
