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
import { IdeaUseCase } from '../../core/usecases/idea.usecase';
import { Idea } from '../../core/entities/idea';
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
  userIdeas : any = [];
  idea: Idea = {
    id: '',
    title: '',
    description: '',
    tags: [],
    userId: '',
    createdAt: '',
    authorName: '',
    visualizations: 0,
    comments: []
  };
  ideaId: string = ''


  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute, private ideaUseCase: IdeaUseCase) { }

  ngOnInit(): void {
    this.getIdea()
  }
  onSubmit(form: any) {
    // Store the form data before confirmation
    this.formData = form.value;
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
        this.updateIdea();
      }
    });
  }

  getIdea(){
    this.ideaId = this.route.snapshot.paramMap.get('id') || '';
    if (this.ideaId) {
      this.ideaUseCase.getDetails(this.ideaId).then((ideaData) => {
        console.log(ideaData)
        if(ideaData){
          this.idea = {
            id: ideaData.id || '',
            title: ideaData.title || '',
            description: ideaData.description || '',
            tags: ideaData.tags
              ? (ideaData.tags as unknown as string).split(',').map((tag: string) => tag.trim())
              : [],
            userId: ideaData.userId || '',
            createdAt: ideaData.createdAt || '',
            authorName: ideaData.authorName || '',
            visualizations: ideaData.visualizations || 0,
            comments: ideaData.comments || [],
          };
        }
      }).catch(error => {
        console.error('Error fetching idea:', error);
        this.snackBar.open('Error fetching idea.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
      });
    }
  }
  discardChanges() {
    this.router.navigate(['/myIdeasPage']);
  }

  updateIdea(){
    this.ideaUseCase.updateIdea(this.formData, this.ideaId).then(() => {
      Swal.fire({
        title: 'Saved Changes',
        text: 'Your changes have been successfully saved.',
        icon: 'success',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/myIdeasPage']);
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
