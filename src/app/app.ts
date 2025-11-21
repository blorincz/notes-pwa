import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './models/note.model';
import { NotesService } from './services/notes.service';
import { NoteEditor } from './components/note-editor/note-editor';
import { NoteList } from './components/note-list/note-list';
import { SearchBar } from './components/search-bar/search-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NoteEditor, // Not NoteEditorComponent
    NoteList, // Not NoteListComponent
    SearchBar, // Not SearchBarComponent
  ],
  templateUrl: './app.html', // This matches your actual file name
  styleUrls: ['./app.css'], // This matches your actual file name
})
export class App {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  isEditing: boolean = false;
  searchTerm: string = '';

  isOnline: boolean = navigator.onLine;

  constructor(private notesService: NotesService) {
    this.loadNotes();

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  loadNotes(): void {
    this.notes = this.notesService.getAllNotes();
    this.filteredNotes = this.notes;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    if (term.trim()) {
      this.filteredNotes = this.notesService.searchNotes(term);
    } else {
      this.filteredNotes = this.notes;
    }
  }

  onCreateNote(): void {
    this.selectedNote = null;
    this.isEditing = true;
  }

  onEditNote(note: Note): void {
    this.selectedNote = note;
    this.isEditing = true;
  }

  onSaveNote(updatedNote: Partial<Note>): void {
    if (this.selectedNote) {
      this.notesService.updateNote(this.selectedNote.id, updatedNote);
    } else {
      this.notesService.createNote(
        updatedNote.title,
        updatedNote.content,
        updatedNote.color || '#ffffff' // Pass the color
      );
    }

    this.isEditing = false;
    this.selectedNote = null;
    this.loadNotes();
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.selectedNote = null;
  }

  onDeleteNote(noteId: string): void {
    this.notesService.deleteNote(noteId);
    this.loadNotes();

    if (this.selectedNote && this.selectedNote.id === noteId) {
      this.isEditing = false;
      this.selectedNote = null;
    }
  }

  getStats(): { total: number; recent: number } {
    return this.notesService.getStats();
  }
}
