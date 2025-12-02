import readline from 'readline';
import { TaskManager } from './TaskManager.ts';
import { Task } from './Task.ts';
import MSG from './messages.json' with { type: 'json' };
import {getHighPriorityTasks, getOverdueTasks} from './queries.ts';;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const taskManager = new TaskManager();
const tasks = taskManager.tasks;


function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function getDifficulty(difficulty_number: number): string {
  switch (difficulty_number) {
    case 1:
      return '🌕🌑🌑';
    case 2:
      return '🌕🌕🌑';
    case 3:
      return '🌕🌕🌕';
    default:
      return 'Sin asignar';
  }
}

//estadisticas
async function showStats(tasks: Task[]): Promise<void> {
  const stats = await getStats(tasks);
  const pending = (stats.pending * stats.total) / 100;
  const onCourse = (stats.onCourse * stats.total) / 100;
  const finished = (stats.finished * stats.total) / 100;
  const canceled = (stats.canceled * stats.total) / 100;

  console.log(
    '\nEstadísticas de tareas:\n--> Total de tareas:',
    stats.total,
    '\n--> Tareas pendientes:',
    stats.pending,
    '//',
    pending,
    '%',
    '\n--> Tareas en curso:',
    stats.onCourse,
    '//',
    onCourse,
    '%',
    '\n--> Tareas finalizadas:',
    stats.finished,
    '//',
    finished,
    '%',
    '\n--> Tareas canceladas:',
    stats.canceled,
    '//',
    canceled,
    '%',
    '\n'
  );
}

async function getStats(tasks: Task[]) {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.getStatus() === 'PENDING').length,
    onCourse: tasks.filter((t) => t.getStatus() === 'IN_PROGRESS').length,
    finished: tasks.filter((t) => t.getStatus() === 'FINISHED').length,
    canceled: tasks.filter((t) => t.getStatus() === 'CANCELED').length,
  };
}




// editar tarea
async function editTask(taskID: number): Promise<void> {
  await taskManager.editTask(taskID, ask);
}

// filtro de tareas por estado o todos
async function showTasksByStatus(statusFilter?: number): Promise<void> {
  const filtered = statusFilter
    ? tasks.filter((t) => t.getStatus() === statusFilter)
    : tasks;

  if (filtered.length === 0) {
    console.log('\nNo hay tareas para mostrar.\n');
    return;
  }

  console.log('\nEstas son tus tareas:\n');
  filtered.forEach((t, i) => console.log(`[${i + 1}]`, t.getTitle()));

  const taskID = parseInt(await ask(MSG.SELECT_TASK_MSG));
  if (taskID === 0) return;

  const taskSelected = filtered[taskID - 1];
  if (!taskSelected) {
    console.log('ID inválido');
    return;
  }

  const difficulty = getDifficulty(taskSelected.getDifficulty());
  const status = taskSelected.getStatus();

  console.log(
    '\nEsta es la tarea que elegiste:\n',
    taskSelected.getTitle(),
    '\n',
    taskSelected.getDescription(),
    '\n',
    'Estado: ',
    status,
    '\n',
    'Dificultad: ',
    difficulty,
    '\n'
  );

  const option = await ask(MSG.EDIT_SELECTED_MSG);
  if (option.toLowerCase() === 'e') await editTask(tasks.indexOf(taskSelected));
}

async function showAllTask() {
  await showTasksByStatus();
}
async function showPendingTask() {
  await showTasksByStatus(1);
}
async function showOnCourseTask() {
  await showTasksByStatus(2);
}
async function showDoneTask() {
  await showTasksByStatus(3);
}

//ordenar tareas por titulo
const sortByTitle = (tasks: Task[])=>
  tasks.slice().sort((a, b) => a.title.localeCompare(b.title));
//ordenar tareas por fecha
const sortByDueDate = (tasks: Task[]) =>
  tasks.slice().sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
//ordenar tareas por dificultad
const sortByDifficulty = (tasks: Task[]) =>
  tasks.slice().sort((a, b) => a.difficulty - b.difficulty);

//ordenar tareas por estado
const sortByStatus = (tasks: Task[]) => 
  tasks.slice().sort((a, b) => a.status.localeCompare(b.status));


function showTasks(tasks: Task[]): void {
  if (tasks.length === 0) {
    console.log('\nNo hay tareas para mostrar.\n');
    return;
  }
  console.log('\nEstas son tus tareas ordenadas:\n');

  tasks.forEach((t, i) => {console.log(`
    [${i + 1}]
    titulo: ${t.title}
    descripcion: ${t.description}
    estado: ${t.status}
    creada en: ${t.dueDate}
    vence en: ${t.dueDate}
    dificultad: ${getDifficulty(t.difficulty)}
    -----------------------------`);
  });

  console.log('\n total de tareas:', tasks.length, '\n');
}

// vista de las tareas
async function viewTasks(): Promise<void> {
  const showList_options = await ask(MSG.SHOW_LIST_MSG);

  switch (showList_options) {
    case '1':
      await showAllTask();
      break;
    case '2':
      await showPendingTask();
      break;
    case '3':
      await showOnCourseTask();
      break;
    case '4':
      await showDoneTask();
      break;
    case '0':
      return;
    default:
      console.log('Opción inválida');
      break;
  }
}
// busqueda de tarea
async function searchTask(): Promise<void> {
  const search = await ask(MSG.SEARCH_MSG);

  const found = tasks.filter(
    (t) => t.getTitle().toLowerCase() === search.toLowerCase()
  );

  if (found.length === 0) {
    console.log('No se encontró ninguna tarea con ese título.');
    return;
  }

  found.forEach((t, i) =>
    console.log(`[${i + 1}]`, t.getTitle(), '\t', t.getDescription())
  );

  const taskID = parseInt(await ask(MSG.SELECT_TASK_MSG));
  if (taskID === 0) return;

  const taskSelected = found[taskID - 1];
  if (!taskSelected) {
    console.log('ID inválido');
    return;
  }

  console.log(
    '\nEsta es la tarea que elegiste:\n',
    taskSelected.getTitle(),
    '\n',
    taskSelected.getDescription(),
    '\n',
    'Estado: ',
    taskSelected.getStatus(),
    '\n',
    'Dificultad: ',
    taskSelected.getDifficulty(),
    '\n'
  );

  const option = await ask(MSG.EDIT_SELECTED_MSG);
  if (option.toLowerCase() === 'e') await editTask(tasks.indexOf(taskSelected));
}

//mostrar tareas ordenadas
async function sortByTask(tasks: Task[]): Promise<void> {  
  const opt = await ask(MSG.SORT_BY_MSG);

  const strategies: Record<string, (t: Task[]) => Task[]> = {
    "1": sortByTitle,
    "2": sortByDueDate,
    "3": sortByDifficulty,
    "4": sortByStatus
  };

  const sorted = strategies[opt]?.(tasks) ?? tasks;
  showTasks(sorted);
}

// agregar tarea
async function addTask(): Promise<void> {
  await taskManager.addTask(ask);
} 

// menu consultas
async function queryMenu(tasks: Task[]): Promise<void> {
  const query = await ask(MSG.QUERY_MENU_MSG);
    switch (query) {
      case "1":
        console.log(getHighPriorityTasks(tasks));
        return queryMenu(tasks);
      case "2":
        console.log(getOverdueTasks(tasks));
        return queryMenu(tasks);
      case "0":
        return menu();
      default:
        console.log("Opción inválida.");
        return queryMenu(tasks);
    }
};




// menu general
async function menu(): Promise<void> {
  const menu_option = await ask(MSG.MENU_MSG);

  switch (menu_option) {
    case '1':
      await viewTasks();
      break;
    case '2':
      await sortByTask(tasks);
      break;
    case '3':
      await searchTask();
      break;
    case '4':
      await addTask();
      break;
    case '5':
      await showStats(tasks);
      break;
      case '6':
      await queryMenu(tasks);
      break;
    case '0':
      rl.close();
      return;
    default:
      console.log('Opcion incorrecta');
      break;
  }
  await menu();
}


//arranque de programa
async function main(): Promise<void> {
  await menu();
}

console.log('********* BIENVENIDO *********');
main();
