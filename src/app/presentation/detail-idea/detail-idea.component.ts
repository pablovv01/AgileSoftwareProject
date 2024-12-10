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
import {MatChip, MatChipSet, MatChipsModule} from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { IdeaUseCase } from '../../core/usecases/idea.usecase';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatSlideToggle, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {CATEGORIES} from '../../core/entities/categoriesTag';
import Swal from 'sweetalert2';
import {User} from '../../core/entities/user';
import {ProfileUseCase} from '../../core/usecases/profile.usecase';
import {Comment} from '../../core/entities/comment';
import {CommentUseCase} from '../../core/usecases/comment.usecase';
import {Idea} from '../../core/entities/idea';

@Component({
  selector: 'detail-idea',
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
    MatChipsModule,
    MatDivider,
    MatIconModule,
    MatSlideToggleModule
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
  uid: string | null = null
  categories = CATEGORIES
  showComments = false
  user: User | null = null
  investorRole: string = 'investor'
  newCommentContent: string = "";
  isPrivate: boolean = false;

  constructor(private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute, private ideaUseCase: IdeaUseCase, private profile: ProfileUseCase, private commentUseCase: CommentUseCase) {
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ideaUseCase.getDetails(id).then(async (ideaData) => {
        this.idea = ideaData;
        this.date = new Date(this.idea.createdAt);
        if (!Array.isArray(this.idea.comments)) {
          console.error('Comments are not an array:', this.idea.comments);
          this.idea.comments = [];
        }
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
    const retrievedSessionObject = sessionStorage.getItem('user');
    if (retrievedSessionObject) {
      const userData = JSON.parse(retrievedSessionObject)
      this.uid = userData.uid;
      const email = userData.email;
      this.user = await this.profile.loadUserInfo(email, this.uid!!)
    } else {
      console.log('No se encontraron datos en sessionStorage.');
    }
  }

  isInvestor() {
    return this.user?.type !== this.investorRole
  }

  isMyIdea() {
    return this.uid == this.idea.userId
  }

  async fetchUserData(): Promise<void> {
    const db = getDatabase();
    const userRef = ref(db, `users/${this.idea.userId}`);

    console.log(this.id);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      this.name = userData.name;
      this.surname = userData.surname;
      console.log(this.name);
    } else {
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

  deleteIdea(ideaId: string) {
    Swal.fire({
      title: 'Delete idea',
      text: 'Are you sure you want to delete this idea? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.ideaUseCase.deleteIdea(ideaId);
          Swal.fire({
            title: 'Deleted!',
            text: 'The idea has been successfully deleted.',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          console.log(`Idea with ID ${ideaId} deleted successfully.`);
          this.goBack()
        } catch (error) {
          console.error('Error deleting idea:', error);
          Swal.fire({
            title: 'Delete error',
            text: 'There was an issue deleting the idea. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        }
      }
    });
  }

  goToEditIdea(ideaId: any) {
    this.router.navigate(['/edit-idea', ideaId]);
  }

  async addNewComment() {
    // Verificar si el contenido del comentario está vacío
    if (!this.newCommentContent.trim()) {
      console.error('Comment content cannot be empty.');
      return;
    }

    // Construir el comentario
    const comment: Comment = {
      authorName: `${this.user?.name} ${this.user?.surname}`,
      reply: [],
      userId: this.uid!!,
      content: this.newCommentContent.trim(),
      publishedDate: new Date().toISOString(),
      private: this.isPrivate,
    };

    try {
      await this.commentUseCase.addComment(this.idea.id, comment);
      console.log('Comment added successfully');
      this.newCommentContent = '';
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  toggleReplyInput(comment: any) {
    comment.showReplyInput = !comment.showReplyInput;  // Alternar la visibilidad del cuadro de respuesta
  }

  sendReply(comment: any, index: number) {
    if (!comment.replyContent || !comment.replyContent.trim()) {
      console.error('Reply content cannot be empty.');
      return;
    }

    const reply: Comment = {
      authorName: `${this.user?.name} ${this.user?.surname}`,
      content: comment.replyContent.trim(),
      publishedDate: new Date().toISOString(),
      reply: [],
      userId: this.uid ?? '',
      private: false,
    };
  }
}

