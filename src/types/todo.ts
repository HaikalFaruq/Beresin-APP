export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export type TodoFormData = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;