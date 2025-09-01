import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Memory } from '../../../services/memory.service';

@Component({
  selector: 'app-memories-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './memories-card.component.html',
  styleUrl: './memories-card.component.scss'
})
export class MemoriesCardComponent {
  @Input() memory!: Memory;

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
