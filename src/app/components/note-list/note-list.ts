import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-list.html',
  styleUrl: './note-list.css',
})
export class NoteList {
  @Input() notes: Note[] = [];
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();

  onEditNote(note: Note): void {
    this.edit.emit(note);
  }

  onDeleteNote(noteId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      this.delete.emit(noteId);
    }
  }

  onCreateNote(): void {
    this.create.emit();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getPreview(content: string): string {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  }
}
