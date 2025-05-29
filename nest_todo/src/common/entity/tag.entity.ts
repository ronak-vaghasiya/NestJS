import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Todo, (todo) => todo.tags)
  todos: Todo[];
}
