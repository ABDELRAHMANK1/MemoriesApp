import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MemoryService } from '../../services/memory.service';

@Component({
  selector: 'app-memories-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './memories-form.component.html',
  styleUrl: './memories-form.component.scss'
})
export class MemoriesFormComponent {
  memoryForm: FormGroup;

  constructor(
    private memoryService: MemoryService,
    private router: Router
  ) {
    this.memoryForm = new FormGroup({
      authorName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  onSubmit(): void {
    if (this.memoryForm.valid) {
      const newMemory = this.memoryForm.value;
      this.memoryService.addMemory(newMemory);
      this.memoryForm.reset();
      this.router.navigate(['/home']);
    }
  }
}
