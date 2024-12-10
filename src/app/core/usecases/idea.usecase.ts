import { Injectable } from '@angular/core';
import { Idea } from '../entities/idea';
import { FirebaseDbService } from '../../data/firebase_db_service';
import { get, getDatabase, push, ref, remove, set, update, query, orderByKey, startAfter, limitToFirst, child } from "firebase/database";

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
  async getIdeas(filterTags?:string[], filterOrder?: string, filterTitle?: string): Promise<{
    ideas: Idea[];
  }> {
    try {
      const snapshot = await this.firebaseDb.getIdeas();
      const data = snapshot.val();

      if (!data) {
        return { ideas: []};
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
        visualizations: data[key].visualizations || 0,
        comments: data[key].comments ? Object.keys(data[key].comments).map(commentKey => ({
          ...data[key].comments[commentKey],
          id: commentKey
        })) : []
      }))
      //Order by Tag
      .filter((idea) =>
        !filterTags || filterTags.every((tag) => idea.tags.includes(tag))
      //Order by Title
      ).filter((idea) =>
        !filterTitle || idea.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
      // Order by filterOrder
      if (filterOrder) {
        ideas.sort(this.getSortFunction(filterOrder));
      }
    return {ideas};
  }catch (error) {
    console.error('Error getting ideas:', error);
    throw new Error('Error getting ideas.');
  }
}

// Función para obtener la lógica de ordenación
private getSortFunction(filterOrder: string): (a: Idea, b: Idea) => number {
  switch (filterOrder) {
    case 'Newest':
      return (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    case 'Oldest':
      return (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    case 'Alphabetical':
      return (a, b) => a.title.localeCompare(b.title);
      case 'Popularity':
      return (a, b) => b.visualizations - a.visualizations;
    default:
      return () => 0; // No ordenar si no se especifica un filtro válido
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

  async updateIdeaVisualizations(idea: Idea){
    try{
      const updatedField = { visualizations: idea.visualizations };
      await this.firebaseDb.updateIdea(idea.id, updatedField);
    } catch (error) {
      console.error('Error editing idea in service:', error);
      throw error;
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
        visualizations: data.visualizations || 0,
        comments: data.comments ? Object.keys(data.comments).map(key => ({
          ...data.comments[key],
          id: key
        })) : []
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
        visualizations: 0,
        userId: sessionStorage.getItem('userId')!  // ID del usuario actual
      };

      await this.firebaseDb.addIdea(newIdea);
    } catch (error) {
      console.error('Error adding idea in service:', error);
      throw error;
    }
  }
}
