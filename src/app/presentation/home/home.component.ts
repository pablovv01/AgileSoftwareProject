import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Idea } from '../../core/entities/idea';
import Swal from 'sweetalert2';
import { IdeaUseCase } from '../../core/usecases/idea.usecase';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userId = sessionStorage.getItem('userId')!;
  userIdeas: Idea[] = [];

  ideas = [
    { title: 'Home', isActive: true },
    { title: 'About Us', isActive: false },
    { title: 'Services', isActive: false },
    { title: 'Contact', isActive: false }
  ];

  constructor(private router: Router, private ideaUseCase: IdeaUseCase) { }

  ngOnInit() {
    this.loadUserIdeas();
  }

  async loadUserIdeas() {
    try {
      this.userIdeas = await this.ideaUseCase.getUserIdeas(this.userId);
      console.log('User Ideas:', this.userIdeas);
    } catch (error) {
      console.error('Error loading user ideas:', error);
    }
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
          this.userIdeas = this.userIdeas.filter(idea => idea.id !== ideaId);
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

  goToAddPost() {
    this.router.navigate(['/add-idea']);
  }

  goToEditIdea(ideaId: any) {
    this.router.navigate(['/edit-idea', ideaId]);
  }

  goToDetailIdea(ideaId: any) {
    this.router.navigate(['/detail', ideaId]);
  }
}