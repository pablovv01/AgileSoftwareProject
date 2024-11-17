import { Injectable } from '@angular/core';
import { Idea } from '../entities/idea';
import { FirebaseDbService } from '../../data/firebase_db_service';

@Injectable({
  providedIn: 'root'
})
export class IdeaUseCase {

  constructor(private firebaseDb: FirebaseDbService) { }

  // Get user ideas
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

  // Delete an idea
  async deleteIdea(ideaId: string): Promise<void> {
    try {
      await this.firebaseDb.deleteIdea(ideaId);
      console.log(`Idea with ID ${ideaId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw new Error('Error deleting idea');
    }
  }

    //Edit an idea
    editIdea(formData: any, idea: any) {
        const { title, description, tags } = formData;
    
        const updatedIdea = {
          title,
          description,
          tags,
          updatedAt: new Date().toISOString(),
          userId: sessionStorage.getItem('userId')!
        };
    
        const ideaId = idea.id;  
        if (!ideaId) {
          console.error('Idea ID is missing!');
          return;
        }
            this.firebaseDb.updateIdea(ideaId, updatedIdea);
      }

      // Get idea details
      async getDetails(id: string): Promise<any> {
        try {
          const ideaData = await this.firebaseDb.getIdeaById(id);
          return ideaData;
        } catch (error) {
          console.error('Error fetching idea in service:', error);
          throw error;
        }
      }

      // Add new idea
      async addIdea(formData: any): Promise<void> {
        try {
          const { title, description, tags } = formData;
          const newIdea = {
            title,
            description,
            tags,
            createdAt: new Date().toISOString(),
            userId: sessionStorage.getItem('userId')!  // ID del usuario actual
          };
    
          await this.firebaseDb.addIdea(newIdea);
        } catch (error) {
          console.error('Error adding idea in service:', error);
          throw error;
        }
      }
}