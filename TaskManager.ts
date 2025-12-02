import { Task } from "./Task.js";
import tasksJson from "./tasks.json" with { type: "json" };

export class TaskManager {
    tasks: Task[] = tasksJson as Task[];

    async addTask(ask: (msg: string) => Promise<string>, messages: any): Promise<void> {
        console.log('Estas creando una nueva tarea\nNO se permiten vacios');

        const newTask: Task = {
        title: '',
        description: '',
        status: '',
        createdAt: '',
        updatedAt: '',
        dueDate: '',
        difficulty: 0,
        };

        const title = await ask(messages.TITLE_MSG);
        if (title.trim() === '') {
        console.log('no se permiten vacios!!');
        return;
        }
        newTask.title = title;

        const desc = await ask(messages.DESC_MSG);
        if (desc.trim() === '') {
        console.log('no se permiten vacios!!');
        return;
        }
        newTask.description = desc;

        const status = parseInt(await ask(messages.STATUS_MSG));
        if (isNaN(status) || status < 1 || status > 4) {
        console.log('**Entrada incorrecta**');
        return;
        }
        newTask.status = status;

        const diff = parseInt(await ask(messages.DIFF_MSG));
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
}
