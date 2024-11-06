import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule here

@Component({
  selector: 'app-add-idea',
  standalone: true,  // Make it a standalone component
  imports: [FormsModule],  // Import FormsModule for template-driven forms
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.css']
})
export class addIdeaComponent {

  onSubmit(form: any) {
    console.log('Form Submitted!', form.value);

    // Connect to the backend here and send the form data to the database.
    
  }
}