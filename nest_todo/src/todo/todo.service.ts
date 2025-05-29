import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '../common/entity/todo.entity';
import { Tag } from '../common/entity/tag.entity';
import { CreateTodoDto } from '../common/dto/create.todo.dto';
import { UpdateTodoDto } from 'src/common/dto/update.todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTodo(createDto: CreateTodoDto): Promise<Partial<Todo>> {
    const tags = await this.tagRepository.findByIds(createDto.tags || []);

    const newTodo = this.todoRepository.create({
      ...createDto,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.todoRepository.save(newTodo);
    return saved;
  }

  async updateTodo(updateDto: UpdateTodoDto & { id: string }): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id: updateDto.id },
      relations: ['tags'],
    });

    if (!todo) throw new NotFoundException('Todo not found');

    const tags = updateDto.tags
      ? await this.tagRepository.findByIds(updateDto.tags)
      : todo.tags;

    const updated = {
      ...todo,
      ...updateDto,
      tags,
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

  async getAllTodos(filters: {
    page?: number;
    perPage?: number;
    title?: string;
    assignedTo?: string;
    status?: string;
    priority?: string;
    tags?: string[];
  }): Promise<{
    todos: Todo[];
    page: number;
    per_page_todos: number;
    total_pages: number;
    total_todos: number;
  }> {
    const {
      page = 1,
      perPage = 10,
      title,
      assignedTo,
      status,
      priority,
      tags,
    } = filters;

    const query = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.tags', 'tag');

    // Filtering
    if (title) {
      query.andWhere('todo.title ILIKE :title', { title: `%${title}%` });
    }

    if (assignedTo) {
      query.andWhere('todo.assignedTo = :assignedTo', { assignedTo });
    }

    if (status) {
      query.andWhere('todo.status = :status', { status });
    }

    if (priority) {
      query.andWhere('todo.priority = :priority', { priority });
    }

    if (tags && tags.length > 0) {
      query.andWhere('tag.id IN (:...tags)', { tags });
    }

    // Prevent duplicate todos when joined with multiple tags
    query.distinct(true);

    const total = await query.getCount();

    // Pagination
    const todos = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();

    return {
      todos,
      page,
      per_page_todos: perPage,
      total_pages: Math.ceil(total / perPage),
      total_todos: total,
    };
  }

  async deleteTodo(id: string): Promise<Todo> {
    const todo = await this.getTodo(id);
    await this.todoRepository.remove(todo);
    return todo;
  }
}
