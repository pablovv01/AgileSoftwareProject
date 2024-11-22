import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent {
  files: File[] = [];
  progress: number = 0;

  // This method is triggered when files are dropped
  onFileDropped(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.files.push(file);  // Add the file to the list
      this.uploadFile(file);  // Trigger file upload (if needed)
    }
  }

  // This method is triggered when files are selected using the browse button
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.onFileDropped(input.files);
    }
  }

  uploadFile(file: File): void {
    // Simulating file upload progress
    const uploadInterval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(uploadInterval);
        // File upload complete
      }
    }, 500);
  }

  // Utility to format file size in a readable format
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // Delete file from the list
  deleteFile(index: number): void {
    this.files.splice(index, 1);
  }
}
