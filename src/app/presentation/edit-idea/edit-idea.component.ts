import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  formData: any = {};  // Guarda los datos del formulario
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

  onSubmit(form: any) {
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
        this.ideaUseCase.editIdea(this.formData, this.idea);
      }
    });
  }

  getData() {
    this.route.paramMap.subscribe(params => {
      this.ideaTitle = params.get('id') ?? '';
    });

    const retrievedSessionObject = sessionStorage.getItem('ideas');
    if (retrievedSessionObject) {
      const userIdeas = JSON.parse(retrievedSessionObject);

      for (let idea of userIdeas) {
        if (idea.title === this.ideaTitle) {
          this.idea = idea; 
          break;
        }
      }
    }
  }

  discardChanges() {
    this.router.navigate(['/home']);
  }
}