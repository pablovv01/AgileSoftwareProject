import { Injectable } from '@angular/core';
import { Idea } from '../entities/idea';
import { FirebaseDbService } from '../../data/firebase_db_service';

@Injectable({
  providedIn: 'root'
})
export class IdeaUseCase {

  constructor(private firebaseDb: FirebaseDbService) { }

  // Obtener las ideas del usuario desde Firebase
  async getUserIdeas(userId: string): Promise<Idea[]> {
    try {
      const snapshot = await this.firebaseDb.getIdeas();
      const userIdeas = snapshot.val();
      const ideasList = Object.keys(userIdeas).map(key => {
        const idea = userIdeas[key];
        if (idea.userId === userId) {
          return { id: key, ...idea };
        } else {
          return null;
        }
      }).filter(idea => idea !== null);

      return ideasList;
    } catch (error) {
      console.error('Error fetching user ideas:', error);
      throw new Error('Error fetching ideas');
    }
  }

  // Eliminar una idea desde Firebase
  async deleteIdea(ideaId: string): Promise<void> {
    try {
      await this.firebaseDb.deleteIdea(ideaId);
      console.log(`Idea with ID ${ideaId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw new Error('Error deleting idea');
    }
  }
}