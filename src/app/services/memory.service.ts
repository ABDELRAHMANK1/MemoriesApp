import { Injectable } from '@angular/core';

export interface Memory {
  id: number;
  title: string;
  description: string;
  authorName: string;
  date: Date;
  photos?: string[]; // Array of base64 encoded images
}

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  private memories: Memory[] = [];
  private nextId = 1;

  constructor() {
    // Load memories from localStorage if available
    this.loadMemoriesFromStorage();
  }

  addMemory(memory: Omit<Memory, 'id' | 'date'>): Memory {
    const newMemory: Memory = {
      ...memory,
      id: this.nextId++,
      date: new Date()
    };
    this.memories.push(newMemory);
    this.saveMemoriesToStorage();
    return newMemory;
  }

  getAllMemories(): Memory[] {
    return [...this.memories];
  }

  getMemoryById(id: number): Memory | undefined {
    return this.memories.find(m => m.id === id);
  }

  updateMemory(id: number, updates: Partial<Omit<Memory, 'id' | 'date'>>): Memory | null {
    const index = this.memories.findIndex(m => m.id === id);
    if (index !== -1) {
      this.memories[index] = { ...this.memories[index], ...updates };
      this.saveMemoriesToStorage();
      return this.memories[index];
    }
    return null;
  }

  deleteMemory(id: number): boolean {
    const index = this.memories.findIndex(m => m.id === id);
    if (index !== -1) {
      this.memories.splice(index, 1);
      this.saveMemoriesToStorage();
      return true;
    }
    return false;
  }

  private saveMemoriesToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('memories', JSON.stringify(this.memories));
    }
  }

  private loadMemoriesFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('memories');
      if (stored) {
        this.memories = JSON.parse(stored);
        if (this.memories.length > 0) {
          this.nextId = Math.max(...this.memories.map(m => m.id)) + 1;
        }
      }
    }
  }
}
