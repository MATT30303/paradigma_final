import { Task } from './Task.ts';
import tasksJson from './tasks.json' with { type: 'json' };
export class TaskManager {
  tasks: Task[] = tasksJson as Task[];
  //equisde
}
