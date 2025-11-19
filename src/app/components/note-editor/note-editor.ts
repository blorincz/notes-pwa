import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.html',
  styleUrl: './note-editor.css',
})
export class NoteEditor implements OnChanges {
  @Input() note: Note | null = null;
  @Output() save = new EventEmitter<Note>();
  @Output() cancel = new EventEmitter<void>();

  title: string = '';
  content: string = '';
  color: string = '#ffffff';

  ngOnChanges(): void {
    if (this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
      this.color = this.note.color || '#ffffff';
    } else {
      this.title = '';
      this.content = '';
      this.color = '#ffffff';
    }
  }

  onSave(): void {
    if (this.title.trim() || this.content.trim()) {
      const updatedNote: Partial<Note> = {
        title: this.title.trim() || 'Untitled Note',
        content: this.content.trim(),
        color: this.color,
      };

      this.save.emit(updatedNote as Note);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onColorChange(color: string): void {
    this.color = color;
  }
}
