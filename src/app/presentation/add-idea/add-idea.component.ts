import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { IdeaUseCase } from '../../core/usecases/idea.usecase';


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
    CommonModule
  ],
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.css']
})
export class addIdeaComponent {
  formData: any = {};  // Holds the form data before submission

  constructor(private router: Router, private ideaUseCase: IdeaUseCase) { }

  onSubmit(form: any) {
    // Store the form data before confirmation
    this.formData = form.value;
    Swal.fire({
      title: 'Add post',
      text: 'Are you sure you want to submit your idea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.ideaUseCase.addIdea(this.formData).then(() => {
          Swal.fire({
            title: 'Add post',
            text: 'Your idea has been submitted successfully!',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['/home']);
          });
        }).catch((error) => {
          Swal.fire({
            title: 'Add post',
            text: 'There was an issue posting your idea. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        });
      }
    });
  }
}