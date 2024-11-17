import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { getDatabase, ref, push, set } from 'firebase/database';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-idea',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.css']
})
export class addIdeaComponent {
  formData: any = {};  // Holds the form data before submission

  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  onSubmit(form: any) {
    // Store the form data before confirmation
    this.formData = form.value;
    Swal.fire({
      title: 'Add post',
      text: 'Are you sure you want to submit your idea?',
      icon: 'warning',
      showCancelButton: true,  // Muestra el botón de "No"
      confirmButtonText: 'Yes',  // Botón de "Yes"
      cancelButtonText: 'No',    // Botón de "No"
      reverseButtons: true,      // Cambia la posición de los botones (No a la izquierda y Yes a la derecha)
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmSubmit();
      }
    });
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
      userId: sessionStorage.getItem('userId')!  // Replace with actual user ID when we implement authentication from the other git branch.
    };

    // Initialize the Realtime Database
    const db = getDatabase();
    const ideasRef = ref(db, 'ideas');
    const newIdeaRef = push(ideasRef);  // Generate a new unique key for the idea to be added and stuff

    set(newIdeaRef, newIdea)
      .then(() => {
        console.log('Idea added successfully!');
        Swal.fire({
          title: 'Add post',
          text: 'Your idea has been submitted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate login after click on ok.
            this.router.navigate(['/home']);
          }
        });
      })
      .catch((error) => {
        console.error('Error adding idea: ', error);
        Swal.fire({
          title: 'Add post',
          text: 'There was an issue posting your idea. Please try again.',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
      });
  }
}