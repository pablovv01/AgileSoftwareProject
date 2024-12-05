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
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import {MatIcon} from '@angular/material/icon';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {CATEGORIES} from '../../core/entities/categoriesTag';

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
    MatDivider,
    MatIcon,
    MatSlideToggle
  ],
  templateUrl: './detail-idea.component.html',
  styleUrl: './detail-idea.component.css'
})

export class DetailIdeaComponent implements OnInit {
  idea: any
  id: string | null = null
  date: Date = new Date()
  name: string | null = null
  surname: string | null = null
  categories = CATEGORIES
  showComments = false
  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private ideaUseCase: IdeaUseCase) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ideaUseCase.getDetails(id).then(async (ideaData) => {
        this.idea = ideaData;
        this.date = new Date(this.idea.createdAt);
        await this.fetchUserData();
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

  async fetchUserData(): Promise<void>
  {
    const db = getDatabase();
    const userRef = ref(db, `users/${this.idea.userId}`);

    console.log(this.id);
    const snapshot = await get(userRef);
    if (snapshot.exists())
    {
      const userData = snapshot.val();
      this.name = userData.name;
      this.surname = userData.surname;
      console.log(this.name);
    }
    else
    {
      console.error('No user data found.');
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  goBack() {
    window.history.back();
  }

  getCategoryColor(tag: string): string {
    const category = this.categories.find(c => c.category === tag);
    return category ? category.colorClass : '';
  }

  getCategoryIcon(tag: string): string {
    const category = this.categories.find(c => c.category === tag);
    return category ? category.icon : '';
  }
}
