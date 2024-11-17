import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {getDatabase, ref, get} from 'firebase/database';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatDivider} from '@angular/material/divider';
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
    MatDialogModule,
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
  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fetchIdea(this.id);
  }

  async fetchIdea(id: string | null): Promise<void> {
    const db = getDatabase();
    const ideaRef = ref(db, `ideas/${id}`);
    const snapshot = await get(ideaRef);
    if (snapshot.exists()) {
      this.idea = snapshot.val();
      this.date = new Date(this.idea.createdAt);
    }
  }
}
