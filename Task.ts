export class Task {
  private title: string;
  private description: string;
  private status: 'PENDING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED';
  private createdAt: string;
  private updatedAt: string;
  private dueDate: string;
  private difficulty: number;
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
    this.status = status as any;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.dueDate = dueDate;
    this.difficulty = difficulty;
  }

  public getTitle(): string {
    return this.title;
  }
  public setTitle(title: string) {
    this.title = title;
  }

  public getDescription(): string {
    return this.description;
  }
  public setDescription(description: string) {
    this.description = description;
  }

public getStatus(): 'PENDING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED' {
  return this.status;
}
public setStatus(status: 'PENDING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED') {
  this.status = status;
}

  public getCreatedAt(): string {
    return this.createdAt;
  }
  public setCreatedAt(createdAt: string) {
    this.createdAt = createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }
  public setUpdatedAt(updatedAt: string) {
    this.updatedAt = updatedAt;
  }

  public getDueDate(): string {
    return this.dueDate;
  }
  public setDueDate(dueDate: string) {
    this.dueDate = dueDate;
  }

  public getDifficulty(): number {
    return this.difficulty;
  }
  public setDifficulty(difficulty: number) {
    this.difficulty = difficulty;
  }
}
