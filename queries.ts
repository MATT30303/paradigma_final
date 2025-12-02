import { Task } from './Task.ts';

// Tarea vencida
export const isOverdue = (task: Task): boolean =>
  new Date(task.getDueDate()) < new Date() && task.getStatus() !== 'FINISHED';

// Tarea de prioridad alta
export const isHighPriority = (task: Task): boolean => task.getDifficulty() >= 3;

export const getHighPriorityTasks = (tasks: Task[]): Task[] =>
  tasks.filter(isHighPriority);

export const getOverdueTasks = (tasks: Task[]): Task[] =>
  tasks.filter(isOverdue);
