import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  assignedTo: string;

  @IsString()
  @IsNotEmpty()
  status: 'pending' | 'in-progress' | 'completed';

  @IsString()
  @IsNotEmpty()
  priority: 'low' | 'medium' | 'high';

  @IsString({ each: true })
  tags: string[];

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;
}
