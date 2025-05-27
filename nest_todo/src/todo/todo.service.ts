import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '../common/entity/todo.entity';
import { CreateTodoDto } from '../common/dto/create.todo.dto';
import { UpdateTodoDto } from 'src/common/dto/update.todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async createTodo(createTodoDto: CreateTodoDto): Promise<Partial<Todo>> {
    const newTodo = this.todoRepository.create({
      ...createTodoDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedTodo = await this.todoRepository.save(newTodo);
    return savedTodo;
  }

  async updateTodo(
    updateTodoDto: UpdateTodoDto & { id: string },
  ): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id: updateTodoDto.id },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    const updated = {
      ...todo,
      ...updateTodoDto,
      updatedAt: new Date(),
    };
    return await this.todoRepository.save(updated);
  }

  async getTodo(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async getAllTodos(): Promise<{ todos: Todo[]; total_todos: number }> {
    const todos = await this.todoRepository.find();
    return {
      todos,
      total_todos: todos.length,
    };
  }

  async deleteTodo(id: string): Promise<Todo> {
    const todo = await this.getTodo(id);
    await this.todoRepository.remove(todo);
    return todo;
  }
}
