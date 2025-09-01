import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemoryService, Memory } from '../../services/memory.service';

@Component({
  selector: 'app-memories-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './memories-list.component.html',
  styleUrl: './memories-list.component.scss'
})
export class MemoriesListComponent implements OnInit {
  memories: Memory[] = [];

  constructor(private memoryService: MemoryService) {}

  ngOnInit(): void {
    this.loadMemories();
  }

  loadMemories(): void {
    this.memories = this.memoryService.getAllMemories();
  }

  deleteMemory(id: number): void {
    if (confirm('Are you sure you want to delete this memory?')) {
      this.memoryService.deleteMemory(id);
      this.loadMemories();
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
