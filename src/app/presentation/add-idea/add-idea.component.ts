import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { Router } from '@angular/router'; 
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; 
import { CommonModule } from '@angular/common';  // Import CommonModule
import { getDatabase, ref, push, set } from 'firebase/database';  

@Component({
  selector: 'app-add-idea',
  standalone: true,
  imports: [
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule,
    CommonModule  // Include CommonModule to access ngIf and ngClass
  ],
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.css']
})
export class addIdeaComponent {
  isConfirmationVisible = false;  // Whether the confirmation modal is visible
  isFormSubmitted = false;  // To track if form is submitted
  formData: any = {};  // Holds the form data before submission

  constructor(private router: Router) {}

  onSubmit(form: any) {
    // Prevent form submission until confirmation
    if (this.isConfirmationVisible) return;
    
    // Store the form data before confirmation
    this.formData = form.value;
    this.isConfirmationVisible = true;
  }

  confirmSubmit() {
    // Proceed with form submission
    console.log('Form Submitted!', this.formData);

    const { title, description, tags } = this.formData;

    const newIdea = {
      title,
      description,
      tags,
      createdAt: new Date().toISOString(),
      userId: "user-uid-placeholder"  // Replace with actual user ID
    };

    // Initialize the Realtime Database
    const db = getDatabase();
    const ideasRef = ref(db, 'ideas');
    const newIdeaRef = push(ideasRef);  // Generate a new unique key for the idea

    set(newIdeaRef, newIdea)
      .then(() => {
        console.log('Idea added successfully!');
        this.isFormSubmitted = true;  // Mark the form as submitted
        setTimeout(() => {
          this.router.navigate(['/bruh']);  // Navigate back to landing page.
        }, 2000);
      })
      .catch((error) => {
        console.error('Error adding idea: ', error);
      });

    this.isConfirmationVisible = false;  // Hide confirmation modal
  }

  cancelSubmit() {
    // Reset form and cancel submission
    this.isConfirmationVisible = false;
  }
}