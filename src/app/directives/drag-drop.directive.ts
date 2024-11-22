import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true
})
export class DragDropDirective {
  @HostBinding('class.fileover') fileOver: boolean = false;
  @Output() fileDropped = new EventEmitter<FileList>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer?.files;
    if (files!.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}