import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  assignedTo: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  })
  status: 'pending' | 'in-progress' | 'completed';

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @ManyToMany(() => Tag, (tag) => tag.todos, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
