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
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';


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

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Submission',
        message:'Are you sure you want to submit your idea?'
      }})

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
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
        this.snackBar.open('Your idea has been submitted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        }).afterDismissed().subscribe(() => {
          this.router.navigate(['/home']); // Navigate back to landing page whenever it is implemented by andres.
        });
      })
      .catch((error) => {
        console.error('Error adding idea: ', error);
        this.snackBar.open('There has been an error adding your idea. Please try again later', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        })
      });
  }
}