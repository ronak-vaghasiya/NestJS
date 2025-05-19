import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  // UsePipes,
  // ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from '../common/dto/create.todo.dto';
import { UpdateTodoDto } from 'src/common/dto/update.todo.dto';
// import { TodoPipe } from './todo.pipe';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(createTodoDto);
  }

  @Get('/allTodos')
  getAllTodos() {
    return this.todoService.getAllTodos();
  }

  @Put('/update/:id')
  updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.updateTodo({ ...updateTodoDto, id });
  }

  // This is an example of using a custom pipe
  // Will working if id type is number

  // @Get('/getTodo/:id')
  // @UsePipes(TodoPipe)
  // getTodo(@Param('id', ParseIntPipe) id: string) {
  //   return this.todoService.getTodo(id);
  // }

  @Get('/getTodo/:id')
  getTodo(@Param('id') id: string) {
    return this.todoService.getTodo(id);
  }

  @Delete('/delete/:id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodo(id);
  }
}
