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
import { getDatabase, ref, get } from 'firebase/database';

@Component({
  selector: 'app-favorite-ideas-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './favorite-ideas-page.component.html',
  styleUrls: ['./favorite-ideas-page.component.css'],
})
export class FavoriteIdeasPageComponent implements OnInit {
  userId = sessionStorage.getItem('userId')!;
  favoriteIdeas: (Idea & { authorName: string })[] = []; // Add `authorName` to each idea
  isLoading: boolean = true;

  constructor(
    private ideaUseCase: IdeaUseCase,
    private profileUseCase: ProfileUseCase,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    try {
      // Step 1: Fetch all favorite idea IDs
      const favorites = await this.profileUseCase.getFavorites(this.userId);

      // Step 2: Fetch details for each idea and author info
      const favoriteDetailsPromises = favorites.map(async (ideaId: string) => {
        const ideaDetails = await this.ideaUseCase.getDetails(ideaId);

        if (ideaDetails) {
          // Step 3: Fetch author data for the current idea
          const authorData = await this.fetchUserData(ideaDetails.userId);

          return {
            ...ideaDetails,
            authorName: `${authorData.name || 'Unknown'} ${authorData.surname || ''}`.trim(),
          };
        }

        return null;
      });

      // Step 4: Resolve all promises and filter out null values
      this.favoriteIdeas = (await Promise.all(favoriteDetailsPromises)).filter(
        (idea): idea is Idea & { authorName: string } => idea !== null
      );
    } catch (error) {
      console.error('Error loading favorite ideas:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an issue loading your favorite ideas. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      this.isLoading = false;
    }
  }

  async fetchUserData(userId: string): Promise<{ name: string; surname: string }> {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Return the user's data
    } else {
      console.error(`No user data found for userId: ${userId}`);
      return { name: 'Unknown', surname: '' }; // Fallback for missing user data
    }
  }

  goToDetailIdea(ideaId: string): void {
    if (ideaId) {
      this.router.navigate(['/detail', ideaId]);
    } else {
      console.error('Invalid idea ID');
    }
  }
}