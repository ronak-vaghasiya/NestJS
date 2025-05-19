export interface Todo {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
