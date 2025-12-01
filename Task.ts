export class Task {
    title: string;
    description: string;
    difficulty: number;
    status: number;

    constructor(title: string, description: string, difficulty: number, status: number) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.status = status;
    }
}
