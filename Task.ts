export class Task {
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  difficulty: number;
  constructor(
    title: string,
    description: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    dueDate: string,
    difficulty: number
  ) {
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.dueDate = dueDate;
    this.difficulty = difficulty;
  }
}
