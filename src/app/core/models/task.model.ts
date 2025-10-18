export interface Task {
  id?: number;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: number;
  updated_at: number;
}

export type TaskCategory = 'Trabajo' | 'Estudios' | 'Hogar' | 'Otros';
export type TaskPriority = 'Baja' | 'Media' | 'Alta';
export type TaskStatus = 'pendiente' | 'completada';

export const TASK_CATEGORIES: TaskCategory[] = ['Trabajo', 'Estudios', 'Hogar', 'Otros'];
export const TASK_PRIORITIES: TaskPriority[] = ['Baja', 'Media', 'Alta'];

export interface TaskFilter {
  category?: TaskCategory | 'Todas';
  priority?: TaskPriority | 'Todas';
  status?: TaskStatus | 'Todas';
}

export class TaskValidator {
  static validateTask(task: Partial<Task>): string[] {
    const errors: string[] = [];
    
    if (!task.title || task.title.trim().length === 0) {
      errors.push('El título es requerido');
    }
    
    if (task.title && task.title.length > 100) {
      errors.push('El título no puede exceder 100 caracteres');
    }
    
    if (task.description && task.description.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }
    
    if (!task.priority) {
      errors.push('La prioridad es requerida');
    }
    
    if (task.priority && !TASK_PRIORITIES.includes(task.priority)) {
      errors.push('Prioridad inválida');
    }
    
    if (task.category && !TASK_CATEGORIES.includes(task.category)) {
      errors.push('Categoría inválida');
    }
    
    return errors;
  }
}