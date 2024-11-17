import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { getDatabase, ref, update } from 'firebase/database';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-idea',
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
  templateUrl: './edit-idea.component.html',
  styleUrl: './edit-idea.component.css'
})
export class EditIdeaComponent implements OnInit {
  formData: any = {};  // Holds the form data before submission
  ideaTitle: string = '';
  userIdeas : any = [];
  idea: any;


  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getData()
  }
  onSubmit(form: any) {
    // Store the form data before confirmation
    this.formData = form.value;

    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     title: 'Confirm Update',
    //     message:'Are you sure you want to update your idea?'
    //   }})

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'confirm') {
    //     this.saveChanges();
    //   }
    // });

    Swal.fire({
      title: 'Edit idea',
      text: 'Are you sure you want to save the changes?',
      icon: 'warning',
      showCancelButton: true,  
      confirmButtonText: 'Yes',  
      cancelButtonText: 'No',    
      reverseButtons: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveChanges();
      }
    });
  }

  getData(){
    // Take idea title in url
    this.route.paramMap.subscribe(params => {
      this.ideaTitle = params.get('id') ?? '';
      console.log(this.ideaTitle);  
    });
    // Recover sessionStorage
    const retrievedSessionObject = sessionStorage.getItem('ideas');
    if (retrievedSessionObject) {
      this.userIdeas = JSON.parse(retrievedSessionObject);

      // Get the selected idea
  for (let idea of this.userIdeas) {
    if (idea.title === this.ideaTitle) {
      this.idea = idea; 
      console.log(idea)
      break;  
    }
  }
    }
  }
  discardChanges() {
    this.router.navigate(['/home']);
  }

  saveChanges(){
    const { title, description, tags } = this.formData;

  const updatedIdea = {
    title,
    description,
    tags,
    updatedAt: new Date().toISOString(),  
    userId: sessionStorage.getItem('userId')!  
  };

  
  const ideaId = this.idea.id;  
  if (!ideaId) {
    console.error('Idea ID is missing!');
    return;
  }

  // Inicialize bbdd
  const db = getDatabase();
  const ideaRef = ref(db, `ideas/${ideaId}`);  // Put the selected id idea

  // Update in bbdd
  update(ideaRef, updatedIdea)
    .then(() => {
      console.log('Idea updated successfully!');
      Swal.fire({
        title: 'Saved Changes',
        text: 'Your changes have been successfully saved.',
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
      console.error('Error updating idea: ', error);
      Swal.fire({
        title: 'Edit error',
        text: 'There was an issue updating your idea. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      });
    });
  }
}
