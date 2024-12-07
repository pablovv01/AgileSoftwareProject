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
      sessionStorage.setItem('ideas', JSON.stringify(ideasList));
      return ideasList;
    } catch (error) {
      console.error('Error fetching user ideas:', error);
      throw new Error('Error fetching ideas');
    }
  }

  // Get the user name for ideas cards
  async getUserIdeaName(userId: string): Promise<{name:string, photo: string}>{
    try {
      const snapshot = await this.firebaseDb.getUserSession(userId);
      let userData = null;
      let name = ""
      let photo= ""
      if (snapshot.exists()) {
      userData = snapshot.val();
      name = userData.name + ' ' + userData.surname
      photo = userData.photo
    }
    return {name, photo}

    } catch (error) {
      console.error('Error fetching user name:', error);
      throw new Error('Error fetching name');
    }
  }


  // Get all ideas
  async getAllIdeas(limit: number, startAfterKey?: string): Promise<{
    ideas: Idea[];
    totalCount: number;
    lastKey: string | undefined;
  }> {
    try {
      const snapshot = await this.firebaseDb.getPaginatedIdeas(limit, startAfterKey);
      const data = snapshot.val();

      if (!data) {
        return { ideas: [], totalCount: 0, lastKey: undefined };
      }

    const ideas: Idea[] = Object.keys(data).map((key) => ({
      id: key,
      title: data[key].title || '',
      description: data[key].description || '',
      tags: data[key].tags
      ? (data[key].tags as string).split(',').map((tag: string) => tag.trim())
      : [],
      userId: data[key].userId || '',
      createdAt: data[key].createdAt || '',
      views: data[key].views || 0
    }));
    console.log(ideas)

    // Obtener la última clave
    const lastKey = Object.keys(data)[Object.keys(data).length - 1];

    // Obtener el total de registros si es necesario
    const totalSnapshot =  await this.firebaseDb.getIdeas();
    const totalCount = totalSnapshot.size || Object.keys(totalSnapshot.val() || {}).length;

    return { ideas, totalCount, lastKey };
  }catch (error) {
    console.error('Error getting paginated ideas:', error);
    throw new Error('Error getting paginated ideas.');
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
  async updateIdea(formData: any, ideaId: string): Promise<void> {
    try {
      const { title, description, tags } = formData;
      const updatedIdea = {
        title,
        description,
        tags: tags.join(','),
        updatedAt: new Date().toISOString(),
        userId: sessionStorage.getItem('userId')!
      };

      await this.firebaseDb.updateIdea(ideaId, updatedIdea);
    } catch (error) {
      console.error('Error editing idea in service:', error);
      throw error;
    }
  }

  // Get idea details
  async getDetails(id: string): Promise<Idea|null> {
    try {
      const snapshot = await this.firebaseDb.getIdeaById(id)
      const data = snapshot.val();
      if (!data) {
        return null;
      }

      return {
        id: id,
        title: data.title || '',
        description: data.description || '',
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
        userId: data.userId || '',
        createdAt: data.createdAt || '',
        views: data.views || 0
      };
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
        tags: tags.join(','),
        createdAt: new Date().toISOString(),
        views: 0,
        userId: sessionStorage.getItem('userId')!  // ID del usuario actual
      };

      await this.firebaseDb.addIdea(newIdea);
    } catch (error) {
      console.error('Error adding idea in service:', error);
      throw error;
    }
  }
}
