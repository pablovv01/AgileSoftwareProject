import { get, getDatabase, push, ref, remove, set, update, query, orderByKey, startAfter, limitToFirst } from "firebase/database";
import { User } from "../core/entities/user";
import { Injectable } from "@angular/core";
import { Idea } from "../core/entities/idea";

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

  // Get all the user information
  async getUserSession(uid: string) {
    const dbRef = this.getDatabaseRef(`users/${uid}`);
    const snapshot = await get(dbRef);
    return snapshot;
  }

  // Get the ideas from Firebase Database
  async getIdeas() {
    const dbRef = this.getDatabaseRef('ideas');
    const snapshot = await get(dbRef);
    return snapshot;
  }

  // Get the ideas from Firebase Database with pagination
  async getPaginatedIdeas(limit: number, startAfterKey?: string) {
    const dbRef = this.getDatabaseRef('ideas');
    let ideasQuery = query(dbRef, orderByKey(), limitToFirst(limit));

    if (startAfterKey) {
      ideasQuery = query(dbRef, orderByKey(), startAfter(startAfterKey), limitToFirst(limit));
    }
    const snapshot = await get(ideasQuery);
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
      const ideaRef = ref(this.db, `ideas/${ideaId}`);
      await update(ideaRef, updatedIdea);
    } catch (error) {
      console.error('Error updating idea in Firebase:', error);
      throw error;
    }
  }

  // Get details of an idea from Firebase Database
  async getIdeaById(id: string): Promise<any> {
    try {
      const ideaRef = ref(this.db, `ideas/${id}`);
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

  async getUserById(id: string): Promise<any> {
    try {
      const db = getDatabase();
      const ideaRef = ref(db, `users/${id}`);
      const snapshot = await get(ideaRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error fetching users from Firebase:', error);
      throw error;
    }
  }

  // Update user data in Firebase Database
  async updateUser(uid: string, user: User) {
    try {
      const userRef = ref(this.db, `users/${uid}`);
      await update(userRef, user);
    } catch (error) {
      console.error('Error updating user in Firebase:', error);
      throw error;
    }
  }

  // Add idea to user's favorites
  async addFavorite(userId: string, ideaId: string): Promise<void> {
    try {
      const favoritesRef = ref(this.db, `users/${userId}/favorites`);
      const snapshot = await get(favoritesRef);

      // If the user already has favorites, push the new favorite idea
      if (snapshot.exists()) {
        const favorites = snapshot.val();
        if (!favorites.includes(ideaId)) {
          favorites.push(ideaId);
          await set(favoritesRef, favorites);
        }
      } else {
        // If no favorites yet, initialize the list with the new favorite
        await set(favoritesRef, [ideaId]);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  // Remove idea from user's favorites
  async removeFavorite(userId: string, ideaId: string): Promise<void> {
    try {
      const favoritesRef = ref(this.db, `users/${userId}/favorites`);
      const snapshot = await get(favoritesRef);

      // If favorites exist, filter out the specified idea
      if (snapshot.exists()) {
        const favorites = snapshot.val();
        const updatedFavorites = favorites.filter((id: string) => id !== ideaId);
        await set(favoritesRef, updatedFavorites);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  // Get user's favorite ideas
  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const favoritesRef = ref(this.db, `users/${userId}/favorites`);
      const snapshot = await get(favoritesRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return []; // Return empty array if no favorites exist
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }
}