import {
  IsDateString,
  IsOptional,
  IsString,
  IsIn,
  IsArray,
} from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'completed'])
  status?: 'pending' | 'in-progress' | 'completed';

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
