import { Injectable } from '@angular/core';
import { Note, NoteModel } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly STORAGE_KEY = 'notes-pwa-data';
  private notes: Note[] = [];

  constructor() {
    this.loadNotes();
  }

  // Load notes from localStorage
  private loadNotes(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notes = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      this.notes = [];
    }
  }

  // Save notes to localStorage
  private saveNotes(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  // Get all notes
  getAllNotes(): Note[] {
    return [...this.notes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // Get note by ID
  getNoteById(id: string): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  // Create new note
  createNote(title: string = 'New Note', content: string = ''): Note {
    const newNote = new NoteModel(title, content);
    this.notes.push(newNote);
    this.saveNotes();
    return newNote;
  }

  // Update existing note
  updateNote(id: string, updates: Partial<Note>): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      this.notes[noteIndex] = {
        ...this.notes[noteIndex],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveNotes();
      return this.notes[noteIndex];
    }
    return undefined;
  }

  // Delete note
  deleteNote(id: string): boolean {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      this.notes.splice(noteIndex, 1);
      this.saveNotes();
      return true;
    }
    return false;
  }

  // Search notes
  searchNotes(query: string): Note[] {
    if (!query.trim()) return this.getAllNotes();

    const lowerQuery = query.toLowerCase();
    return this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get note statistics
  getStats(): { total: number; recent: number } {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent = this.notes.filter((note) => new Date(note.updatedAt) > oneWeekAgo).length;

    return {
      total: this.notes.length,
      recent,
    };
  }
}
