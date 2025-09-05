import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MemoryService, Memory } from '../../services/memory.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-memories-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './memories-list.component.html',
  styleUrl: './memories-list.component.scss',
  animations: [
    trigger('cardAnimation', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]),
    trigger('hoverAnimation', [
      state('hover', style({ transform: 'scale(1.05)', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' })),
      state('normal', style({ transform: 'scale(1)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' })),
      transition('normal <=> hover', animate('200ms ease-in-out'))
    ])
  ]
})
export class MemoriesListComponent implements OnInit {
  memories: Memory[] = [];
  filteredMemories: Memory[] = [];
  searchTerm: string = '';
  hoveredCard: number | null = null;
  selectedMemory: Memory | null = null;

  constructor(private memoryService: MemoryService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadMemories();
  }

  loadMemories(): void {
    this.memories = this.memoryService.getAllMemories();
    this.filteredMemories = this.memories;
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

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMemories = this.memories.filter(memory =>
      memory.title.toLowerCase().includes(term) ||
      memory.description.toLowerCase().includes(term) ||
      memory.authorName.toLowerCase().includes(term)
    );
  }

  openMemoryModal(memory: Memory): void {
    this.selectedMemory = memory;
    this.renderer.addClass(document.body, 'modal-open');
  }

  closeMemoryModal(): void {
    this.selectedMemory = null;
    this.renderer.removeClass(document.body, 'modal-open');
  }
}
