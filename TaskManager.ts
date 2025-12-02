import { Task } from "./Task.ts";
import tasksJson from "./tasks.json" with { type: "json" };
import MSG from './messages.json' with { type: 'json' };
export class TaskManager {
    tasks: Task[] = tasksJson as Task[];

    async addTask(ask: (msg: string) => Promise<string>): Promise<void> {
        console.log('Estas creando una nueva tarea\nNO se permiten vacios');

        const newTask: Task = {
        title: '',
        description: '',
        status: 'PENDING',
        createdAt: '',
        updatedAt: '',
        dueDate: '',
        difficulty: 0,
        };

        const title = await ask(MSG.TITLE_MSG);
        if (title.trim() === '') {
        console.log('no se permiten vacios!!');
        return;
        }
        newTask.title = title;

        const desc = await ask(MSG.DESC_MSG);
        if (desc.trim() === '') {
        console.log('no se permiten vacios!!');
        return;
        }
        newTask.description = desc;

        const status = parseInt(await ask(MSG.STATUS_MSG));
        switch(status){
            case 1:
                newTask.status = 'PENDING';
                break;
            case 2:
                newTask.status = 'IN_PROGRESS';
                break;
            case 3:
                newTask.status = 'FINISHED';
                break;
            case 4:
                newTask.status = 'CANCELED';
                break;
            default:
                console.log('**Entrada incorrecta**');
        }
        

        const diff = parseInt(await ask(MSG.DIFF_MSG));
        if (isNaN(diff) || diff < 1 || diff > 3) {
        console.log('**Entrada incorrecta**');
        return;
        }
        newTask.difficulty = diff;

        const now = new Date().toISOString();
        newTask.createdAt = now;

        const dueDate = await ask("Fecha límite (YYYY-MM-DD): ");
        if (dueDate.trim() === "") {
        console.log("no se permiten vacíos!!");
        return;
        }
        newTask.dueDate = dueDate;

        this.tasks.push(newTask);
        console.log('\n Datos guardados correctamente!');
    }

    async editTask(taskID: number, ask: (msg: string) => Promise<string>): Promise<void> {
        const task = this.tasks[taskID];

        if (!task) {
        console.log('No existe una tarea con ese ID.');
        return;
        }

        console.log(`\nEstas editando la tarea "${task.title}"\n`);
        console.log(
        '- Si deseas mantener los valores de un atributo, simplemente dejalo en blanco.'
        );
        console.log('- Si deseas dejar en blanco un atributo, escribe un espacio');

        const desc = await ask(MSG.DESC_MSG);
        if (desc !== '') task.description = desc;

        const status = await ask(MSG.STATUS_MSG);
        if (status !== '') {
        const num = parseInt(status);
        switch (num) {
            case 1:
            task.status = 'PENDING';
            break;
            case 2:
            task.status = 'IN_PROGRESS';
            break;
            case 3:
            task.status = 'FINISHED';
            break;
            case 4:
            task.status = 'CANCELED';
            break;
            default:
            console.log('**Entrada incorrecta**');
            break;
        }
        }

        const diff = await ask(MSG.DIFF_MSG);
        if (diff !== '') task.difficulty = parseInt(diff);

        console.log('\nDatos guardados!');
    }
}
//nashei
