import { Task } from "./Task.ts";
import tasksJson from "./tasks.json" with { type: "json" };
import MSG from './messages.json' with { type: 'json' };
export class TaskManager {
    tasks: Task[] = tasksJson.map(
    t => new Task(
        t.title || '',
        t.description || '',
        t.status || 'PENDING',
        t.createdAt || '',
        t.updatedAt || '',
        t.dueDate || '',
        t.difficulty || 0
    )
    );


    async addTask(ask: (msg: string) => Promise<string>): Promise<void> {
        console.log('Estas creando una nueva tarea\nNO se permiten vacios');

    const newTask = new Task(
        '',         // title
        '',         // description
        'PENDING',  // status
        '',         // createdAt
        '',         // updatedAt
        '',         // dueDate
        0           // difficulty
    );

        const title = await ask(MSG.TITLE_MSG);
        if (title.trim() === '') {
        console.log('no se permiten vacios!!');
        return;
        }
        newTask.setTitle(title);

        const desc = await ask(MSG.DESC_MSG);
        if (desc.trim() === '') {
        console.log('no se permiten vacios!!');
        return;
        }
        newTask.setDescription(desc);

        const status = parseInt(await ask(MSG.STATUS_MSG));
        switch(status){
            case 1:
                newTask.setStatus('PENDING');
                break;
            case 2:
                newTask.setStatus('IN_PROGRESS');
                break;
            case 3:
                newTask.setStatus('FINISHED');
                break;
            case 4:
                newTask.setStatus('CANCELED');
                break;
            default:
                console.log('**Entrada incorrecta**');
        }
        

        const diff = parseInt(await ask(MSG.DIFF_MSG));
        if (isNaN(diff) || diff < 1 || diff > 3) {
        console.log('**Entrada incorrecta**');
        return;
        }
        newTask.setDifficulty(diff);

        const now = new Date().toISOString();
        newTask.setCreatedAt(now);

        const dueDate = await ask("Fecha límite (YYYY-MM-DD): ");
        if (dueDate.trim() === "") {
        console.log("no se permiten vacíos!!");
        return;
        }
        newTask.setDueDate(dueDate);

        this.tasks.push(newTask);
        console.log('\n Datos guardados correctamente!');
    }

    async editTask(taskID: number, ask: (msg: string) => Promise<string>): Promise<void> {
        const task = this.tasks[taskID];

        if (!task) {
        console.log('No existe una tarea con ese ID.');
        return;
        }

        console.log(`\nEstas editando la tarea "${task.getTitle()}"\n`);
        console.log(
        '- Si deseas mantener los valores de un atributo, simplemente dejalo en blanco.'
        );
        console.log('- Si deseas dejar en blanco un atributo, escribe un espacio');

        const desc = await ask(MSG.DESC_MSG);
        if (desc !== '') task.setDescription(desc);

        const status = await ask(MSG.STATUS_MSG);
        if (status !== '') {
        const num = parseInt(status);
        switch (num) {
            case 1:
            task.setStatus('PENDING');
            break;
            case 2:
            task.setStatus('IN_PROGRESS');
            break;
            case 3:
            task.setStatus('FINISHED');
            break;
            case 4:
            task.setStatus('CANCELED');
            break;
            default:
            console.log('**Entrada incorrecta**');
            break;
        }
        }

        const diff = await ask(MSG.DIFF_MSG);
        if (diff !== '') task.setDifficulty(parseInt(diff));

        console.log('\nDatos guardados!');
    }

    async deleteTask(taskID: number): Promise<void> {
        const task = this.tasks[taskID];
        if (!task) {
            console.log("No existe una tarea con ese ID.");
            return;
        }

        this.tasks.splice(taskID, 1);

        console.log("Tarea eliminada correctamente.");
    }
}

