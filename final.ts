const readline = require('readline');
import Tasks from './tasks.json' assert { type: 'json' };
interface Task {
  title: string;
  description: string;
  difficulty: number;
  status: number;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tasks: Task[] = [
  { title: 'tarea1', description: 'descripcion1', difficulty: 1, status: 1 },
  { title: 'tarea2', description: 'descripcion2', difficulty: 2, status: 2 },
  { title: 'tarea3', description: 'descripcion3', difficulty: 3, status: 3 },
];

// mensajes
const MENU_MSG =
  '\nQue deseas hacer?\n \n[1] Ver mis tareas.\n[2] Buscar mis tareas.\n[3] Agregar una tarea.\n[0] Salir.\n-->';

const SHOW_LIST_MSG =
  '\nQue tareas deseas ver?\n \n[1] Todas. \n[2] Pendientes. \n[3] En curso. \n[4] Terminadas. \n[0] Volver.\n-->';

const SELECT_TASK_MSG =
  '\nDeseas ver los detalles de alguna?\nIntroduce el numero para verla o 0 para volver\n-->';

const EDIT_SELECTED_MSG =
  '\nSi deseas editarla, presiona E, o presiona 0 para volver\n-->';

const SEARCH_MSG = 'Introduce el titulo de una tarea para buscarla:\n--> ';

const TITLE_MSG = '0. Ingresa un titulo: -->';
const DESC_MSG = '1. Ingresa la descripcion: -->';
const STATUS_MSG =
  '2. Estado ([1] Pendiente  /  [2] En curso  /  [3] Terminado  /  [4] Cancelada): -->';
const DIFF_MSG = '3. Dificultad ([1]  /  [2]  /  [3]): -->';

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function getStatus(status_number: number): string {
  switch (status_number) {
    case 1:
      return 'Pendiente';
    case 2:
      return 'En curso';
    case 3:
      return 'Terminado';
    case 4:
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
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

// editar tarea
async function editTask(taskID: number): Promise<void> {
  const task = tasks[taskID];

  if (!task) {
    console.log('No existe una tarea con ese ID.');
    return;
  }

  console.log(`\nEstas editando la tarea "${task.title}"\n`);
  console.log(
    '- Si deseas mantener los valores de un atributo, simplemente dejalo en blanco.'
  );
  console.log('- Si deseas dejar en blanco un atributo, escribe un espacio');

  const desc = await ask(DESC_MSG);
  if (desc !== '') task.description = desc;

  const status = await ask(STATUS_MSG);
  if (status !== '') task.status = parseInt(status);

  const diff = await ask(DIFF_MSG);
  if (diff !== '') task.difficulty = parseInt(diff);

  console.log('\n Datos guardados!');
  await menu();
}
// vista de las tareas
async function menuTasks(): Promise<void> {
  const showList_options = await ask(SHOW_LIST_MSG);

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

async function showTasksByStatus(statusFilter?: number): Promise<void> {
  const filtered = statusFilter
    ? tasks.filter((t) => t.status === statusFilter)
    : tasks;

  if (filtered.length === 0) {
    console.log('\nNo hay tareas para mostrar.\n');
    return;
  }

  console.log('\nEstas son tus tareas:\n');
  filtered.forEach((t, i) => console.log(`[${i + 1}]`, t.title));

  const taskID = parseInt(await ask(SELECT_TASK_MSG));
  if (taskID === 0) return;

  const taskSelected = filtered[taskID - 1];
  if (!taskSelected) {
    console.log('ID inválido');
    return;
  }

  const difficulty = getDifficulty(taskSelected.difficulty);
  const status = getStatus(taskSelected.status);

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

  const option = await ask(EDIT_SELECTED_MSG);
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
  const search = await ask(SEARCH_MSG);

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

  const taskID = parseInt(await ask(SELECT_TASK_MSG));
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

  const option = await ask(EDIT_SELECTED_MSG);
  if (option.toLowerCase() === 'e') await editTask(tasks.indexOf(taskSelected));
}

// agregar tarea
async function addTask(): Promise<void> {
  console.log('Estas creando una nueva tarea\nNO se permiten vacios');

  const newTask: Task = {
    title: '',
    description: '',
    difficulty: 0,
    status: 0,
  };

  const title = await ask(TITLE_MSG);
  if (title.trim() === '') {
    console.log('no se permiten vacios!!');
    return;
  }
  newTask.title = title;

  const desc = await ask(DESC_MSG);
  if (desc.trim() === '') {
    console.log('no se permiten vacios!!');
    return;
  }
  newTask.description = desc;

  const status = parseInt(await ask(STATUS_MSG));
  if (isNaN(status) || status < 1 || status > 4) {
    console.log('**Entrada incorrecta**');
    return;
  }
  newTask.status = status;

  const diff = parseInt(await ask(DIFF_MSG));
  if (isNaN(diff) || diff < 1 || diff > 3) {
    console.log('**Entrada incorrecta**');
    return;
  }
  newTask.difficulty = diff;

  tasks.push(newTask);
  console.log('\n Datos guardados correctamente!');
}

async function menu(): Promise<void> {
  const menu_option = await ask(MENU_MSG);

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
