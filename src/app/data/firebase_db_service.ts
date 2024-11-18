import { get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { User } from "../core/entities/user";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class FirebaseDbService {

  private db = getDatabase();

  constructor() { }

  // Get reference to Firebase Database
  getDatabaseRef(path: string) {
    const db = getDatabase();
    return ref(db, path);
  }

  // Save user data into the database
  saveUserData(userId: string, user: User): Promise<void> {
    return set(ref(this.db, 'users/' + userId), user);
  }

  // Get the ideas from Firebase Database
  async getIdeas() {
    const dbRef = this.getDatabaseRef('ideas');
    const snapshot = await get(dbRef);
    return snapshot;
  }

  // Delete idea from Firebase Database
  async deleteIdea(ideaID: string) {
    const dbRef = this.getDatabaseRef(`ideas/${ideaID}`);
    await remove(dbRef);
  }

  // Updates idea in Firebase Database
  async updateIdea(ideaId: string, updatedIdea: any) {
    try {
      const db = getDatabase();
      const ideaRef = ref(db, `ideas/${ideaId}`);
      await update(ideaRef, updatedIdea);
    } catch (error) {
      console.error('Error updating idea in Firebase:', error);
      throw error;
    }
  }

  // Get details of an idea from Firebase Database
  async getIdeaById(id: string): Promise<any> {
    try {
      const db = getDatabase();
      const ideaRef = ref(db, `ideas/${id}`);
      const snapshot = await get(ideaRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        throw new Error('Idea not found');
      }
    } catch (error) {
      console.error('Error fetching idea from Firebase:', error);
      throw error;
    }
  }

  // Add new idea to Firebase Database
  async addIdea(newIdea: any): Promise<void> {
    try {
      const db = getDatabase();
      const ideasRef = ref(db, 'ideas');
      const newIdeaRef = push(ideasRef);

      await set(newIdeaRef, newIdea);
    } catch (error) {
      console.error('Error adding idea to Firebase:', error);
      throw error;
    }
  }
}