import { Injectable } from '@nestjs/common';
import { Todo } from './todo.interface';
import { randomBytes } from 'crypto';
import { CreateTodoDto } from '../common/dto/create.todo.dto';
import { UpdateTodoDto } from 'src/common/dto/update.todo.dto';

@Injectable()
export class TodoService {
  private readonly todos: Todo[] = [];

  private generateId(length = 32): string {
    return randomBytes(Math.ceil((length * 3) / 4))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  }

  private generateUniqueId(length = 32): string {
    let id: string;
    do {
      id = this.generateId(length);
    } while (this.todos.find((todo) => todo.id === id));
    return id;
  }

  createTodo(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.generateUniqueId(),
      ...createTodoDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  updateTodo(updateTodoDto: UpdateTodoDto & { id: string }): Todo {
    const todoIndex = this.todos.findIndex(
      (todo) => todo.id === updateTodoDto.id,
    );
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    const updatedTodo: Todo = {
      ...this.todos[todoIndex],
      ...updateTodoDto,
      updatedAt: new Date(),
    };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  getTodo(id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  getAllTodos(): { todos: Todo[]; total_todos: number } {
    return {
      todos: this.todos,
      total_todos: this.todos.length,
    };
  }

  deleteTodo(id: string): Todo {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    const deletedTodo = this.todos[todoIndex];
    this.todos.splice(todoIndex, 1);
    return deletedTodo;
  }
}
