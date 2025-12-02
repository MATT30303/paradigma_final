import { Task } from './Task.ts';

// Tarea vencida
export const isOverdue = (task: Task): boolean =>
  new Date(task.dueDate) < new Date() && task.status !== 'FINISHED';

// Tarea de prioridad alta
export const isHighPriority = (task: Task): boolean => task.difficulty >= 3;

export const getHighPriorityTasks = (tasks: Task[]): Task[] =>
  tasks.filter(isHighPriority);

export const getOverdueTasks = (tasks: Task[]): Task[] =>
  tasks.filter(isOverdue);
