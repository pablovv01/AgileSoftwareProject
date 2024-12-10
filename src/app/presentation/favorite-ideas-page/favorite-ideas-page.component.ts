import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeaUseCase } from '../../core/usecases/idea.usecase';
import { ProfileUseCase } from '../../core/usecases/profile.usecase';
import { Idea } from '../../core/entities/idea';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-favorite-ideas-page',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule],
  templateUrl: './favorite-ideas-page.component.html',
  styleUrls: ['./favorite-ideas-page.component.css']
})

export class FavoriteIdeasPageComponent implements OnInit {
  userId = sessionStorage.getItem('userId')!;
  favoriteIdeas: Idea[] = [];  // Store the favorited ideas
  isLoading: boolean = true;

  constructor(
    private ideaUseCase: IdeaUseCase,
    private profileUseCase: ProfileUseCase,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    try {
      const favorites = await this.profileUseCase.getFavorites(this.userId);  // Fetch the favorite idea IDs from the DB
      const favoriteDetailsPromises = favorites.map(async (ideaId: string) => {
        const ideaDetails = await this.ideaUseCase.getDetails(ideaId);  // Fetch idea details by ID
        return ideaDetails;
      });
      
      this.favoriteIdeas = await Promise.all(favoriteDetailsPromises);  // Wait for all details to be fetched
    } catch (error) {
      console.error('Error loading favorite ideas:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an issue loading your favorite ideas. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      this.isLoading = false;
    }
  }

  goToDetailIdea(ideaId: string): void {
    console.log("Idea ID:", ideaId); // Log the ID to check if it's undefined
    if (ideaId) {
      this.router.navigate(['/detail', ideaId]);
    } else {
      console.error("Invalid idea ID");
    }
  }
}