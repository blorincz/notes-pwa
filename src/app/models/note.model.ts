export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  tags?: string[];
}

export class NoteModel implements Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
  tags: string[];

  constructor(title: string = '', content: string = '') {
    this.id = this.generateId();
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.color = '#ffffff';
    this.tags = [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}