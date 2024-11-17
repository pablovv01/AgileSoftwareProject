import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { IdeaUseCase } from '../../core/usecases/idea.usecase';

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
  ],
  templateUrl: './edit-idea.component.html',
  styleUrls: ['./edit-idea.component.css']
})
export class EditIdeaComponent implements OnInit {
  formData: any = {};
  ideaTitle: string = '';
  idea: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ideaUseCase: IdeaUseCase
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  onSubmit(form: any): void {
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
        this.ideaUseCase.updateIdea(this.formData, this.idea.id).then(() => {
          Swal.fire({
            title: 'Saved Changes',
            text: 'Your changes have been successfully saved.',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['/home']);
          });
        }).catch((error) => {
          Swal.fire({
            title: 'Edit error',
            text: 'There was an issue updating your idea. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        });
      }
    });
  }

  getData(): void {
    this.route.paramMap.subscribe(params => {
      this.ideaTitle = params.get('id') ?? '';
    });

    const retrievedSessionObject = sessionStorage.getItem('ideas');
    if (retrievedSessionObject) {
      const userIdeas = JSON.parse(retrievedSessionObject);
      this.idea = userIdeas.find((idea: any) => idea.title === this.ideaTitle);
    }
  }

  discardChanges(): void {
    this.router.navigate(['/home']);
  }
}