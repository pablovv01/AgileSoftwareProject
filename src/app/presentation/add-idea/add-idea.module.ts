import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';   // Import FormsModule
import { AddIdeaComponent } from './add-idea.component'; // Import your AddIdeaComponent

@NgModule({
  declarations: [AddIdeaComponent], // Declare the AddIdeaComponent
  imports: [
    CommonModule,   // Import CommonModule for common Angular directives
    FormsModule     // Import FormsModule to use ngModel for two-way data binding
  ],
  exports: [AddIdeaComponent] // Export the component if you want to use it in other modules
})
export class AddIdeaModule { }