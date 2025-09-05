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
  selectedFiles: { file: File; preview: string }[] = [];

  constructor(
    private memoryService: MemoryService,
    private router: Router
  ) {
    this.memoryForm = new FormGroup({
      authorName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      photos: new FormControl([]) // optional photos array
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file type
        if (!allowedTypes.includes(file.type)) {
          alert(`File "${file.name}" is not supported. Please upload JPEG, PNG, GIF, or WebP images only.`);
          continue;
        }

        // Check file size
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" is too large. Maximum file size is 5MB.`);
          continue;
        }

        // Optimize and compress image
        this.optimizeImage(file).then(optimizedFile => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedFiles.push({
              file: optimizedFile,
              preview: e.target?.result as string
            });
          };
          reader.readAsDataURL(optimizedFile);
        });
      }
    }
  }

  private optimizeImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Resize if too large (max 1920px width/height)
        const maxDimension = 1920;
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            resolve(file); // Fallback to original
          }
        }, file.type, 0.8); // 80% quality
      };

      img.src = URL.createObjectURL(file);
    });
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.memoryForm.valid) {
      const formValue = this.memoryForm.value;

      // Convert selected files to base64 strings
      const photoPromises = this.selectedFiles.map(fileObj => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(fileObj.file);
        });
      });

      Promise.all(photoPromises).then(photos => {
        const newMemory = {
          ...formValue,
          photos: photos.length > 0 ? photos : undefined
        };

        this.memoryService.addMemory(newMemory);
        this.memoryForm.reset();
        this.selectedFiles = [];
        this.router.navigate(['/home']);
      });
    }
  }
}
