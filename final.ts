import readline from 'readline';
import { TaskManager } from './TaskManager.ts';
import { Task } from './Task.ts';
import MSG from './messages.json' with { type: 'json' };
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
function showStats(tasks: Task[]): void {
  const stats = getStats(tasks);
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

function getStats(tasks: Task[]) {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    onCourse: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    finished: tasks.filter((t) => t.status === 'FINISHED').length,
    canceled: tasks.filter((t) => t.status === 'CANCELED').length,
  };
}



// editar tarea
async function editTask(taskID: number): Promise<void> {
  await taskManager.editTask(taskID, ask);
}


// vista de las tareas
async function menuTasks(): Promise<void> {
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

async function showTasksByStatus(statusFilter?: any): Promise<void> {
  const filtered = statusFilter
    ? tasks.filter((t) => t.status === statusFilter)
    : tasks;

  if (filtered.length === 0) {
    console.log('\nNo hay tareas para mostrar.\n');
    return;
  }

  console.log('\nEstas son tus tareas:\n');
  filtered.forEach((t, i) => console.log(`[${i + 1}]`, t.title));

  const taskID = parseInt(await ask(MSG.SELECT_TASK_MSG));
  if (taskID === 0) return;

  const taskSelected = filtered[taskID - 1];
  if (!taskSelected) {
    console.log('ID inválido');
    return;
  }

  const difficulty = getDifficulty(taskSelected.difficulty);
  const status = taskSelected.status;

  console.log(
    '\nEsta es la tarea que elegiste:\n',
    taskSelected.title,
    '\n',
    taskSelected.description,
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

// busqueda de tarea
async function searchTask(): Promise<void> {
  const search = await ask(MSG.SEARCH_MSG);

  const found = tasks.filter(
    (t) => t.title.toLowerCase() === search.toLowerCase()
  );

  if (found.length === 0) {
    console.log('No se encontró ninguna tarea con ese título.');
    return;
  }

  found.forEach((t, i) =>
    console.log(`[${i + 1}]`, t.title, '\t', t.description)
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
    taskSelected.title,
    '\n',
    taskSelected.description,
    '\n',
    'Estado: ',
    taskSelected.status,
    '\n',
    'Dificultad: ',
    taskSelected.difficulty,
    '\n'
  );

  const option = await ask(MSG.EDIT_SELECTED_MSG);
  if (option.toLowerCase() === 'e') await editTask(tasks.indexOf(taskSelected));
}

async function addTask(): Promise<void> {
  await taskManager.addTask(ask);
}


async function menu(): Promise<void> {
  const menu_option = await ask(MSG.MENU_MSG);

  switch (menu_option) {
    case '1':
      await menuTasks();
      break;
    case '2':
      await searchTask();
      break;
    case '3':
      await addTask();
      break;
    case '4':
      showStats(tasks);
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

async function main(): Promise<void> {
  await menu();
}

console.log('********* BIENVENIDO *********');
main();
