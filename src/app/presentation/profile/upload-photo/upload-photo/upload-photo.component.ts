import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css'],
})
export class UploadPhotoComponent {
  @Output() fileSelected = new EventEmitter<File>();
  file: File | null = null;
  progress: number = 0;

  constructor(
    private dialogRef: MatDialogRef<UploadPhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Manejar selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFile(input.files[0]);
    }
  }

  // Configurar y emitir el archivo seleccionado
  setFile(file: File): void {
    this.file = file;
    this.fileSelected.emit(file);
    this.uploadFile();
  }

  // Simular subida de archivo con progreso
  uploadFile(): void {
    this.progress = 0;
    const uploadInterval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(uploadInterval);
      }
    }, 500);
  }

  deleteFile(): void {
    this.file = null;
    this.progress = 0;
  }

  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onConfirm(): void {
    if (this.file) {
      this.dialogRef.close(this.file);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
