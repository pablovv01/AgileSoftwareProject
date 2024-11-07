import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { Router } from '@angular/router'; // To navigate after post submission
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { getDatabase, ref, push, set } from 'firebase/database';  // Firebase Realtime Database imports

@Component({
  selector: 'app-add-idea',
  standalone: true,  // Make it a standalone component
  imports: [FormsModule,
            MatCardModule,
            MatFormFieldModule,
            MatSelectModule,
            MatInputModule
  ],
    // Import FormsModule for template-driven forms
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.css']
})
export class addIdeaComponent {

  constructor(private router: Router) {}

  onSubmit(form: any) {
    console.log('Form Submitted!', form.value);

    const { title, description, tags } = form.value;

    const newIdea = {
      title,
      description,
      tags,
      createdAt: new Date().toISOString(),
      userId: "user-uid-placeholder" // Replace with actual user ID if available
    };

    // Initialize the Realtime Database
    const db = getDatabase();

    // Create a reference to the "ideas" node in the database and push a new key
    const ideasRef = ref(db, 'ideas');
    const newIdeaRef = push(ideasRef);  // Generate a new unique key for the idea

    // Use `set` to add the new idea at the new key
    set(newIdeaRef, newIdea)
      .then(() => {
        console.log('Idea added successfully!');
        this.router.navigate(['/ideas']);
      })
      .catch((error) => {
        console.error('Error adding idea: ', error);
      });
  }
}