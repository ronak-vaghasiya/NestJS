export class UpdateTodoDto {
  id: string;
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: Date;
}
