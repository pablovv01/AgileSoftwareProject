import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
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
    MatSnackBarModule,
    MatChipSet,
    MatChip,
    MatDivider
  ],
  templateUrl: './detail-idea.component.html',
  styleUrl: './detail-idea.component.css'
})

export class DetailIdeaComponent implements OnInit {
  idea: any
  id: string | null = null
  date: Date = new Date()
  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private ideaUseCase: IdeaUseCase) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ideaUseCase.getDetails(id).then((ideaData) => {
        this.idea = ideaData;
        this.date = new Date(this.idea.createdAt);
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
}