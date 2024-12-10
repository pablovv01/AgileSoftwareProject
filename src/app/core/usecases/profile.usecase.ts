import { Injectable } from "@angular/core";
import { FirebaseAuthService } from "../../data/firebase_auth_service";
import { FirebaseDbService } from "../../data/firebase_db_service";
import { User } from "../entities/user";

@Injectable({
  providedIn: 'root'
})
export class ProfileUseCase {
  constructor(private firebaseAuthService: FirebaseAuthService, private firebaseDb: FirebaseDbService) { }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      this.firebaseAuthService.changePassword(oldPassword, newPassword)
    }
    catch (error) {
      throw error
    }
  }

  async loadUserInfo(email: string, uid: string): Promise<User> {
    try {
      const userDb = await this.firebaseDb.getUserById(uid);
      const user = new User(
        userDb.name || "Unknown",
        userDb.surname || "Unknown",
        email,
        userDb.type || "Unknown",
        userDb.photo || "",
        userDb.center,
        userDb.degree,
        userDb.company,
        userDb.position,
        userDb.description,
        userDb.favorites || []
      );

      return user;
    } catch (error) {
      console.error('Error loading user info:', error);
      throw error;
    }
  }

  async updateProfile(user: User) {
    try {
      await this.firebaseDb.updateUser(this.firebaseAuthService.getCurrentUser().uid, user)
    } catch (error) {
      console.error('Error updating user in Firebase:', error);
      throw error;
    }
  }

  async updateEmail(user: User): Promise<void> {
    try {
      await this.firebaseAuthService.updateEmail(user.email);
      await this.firebaseAuthService.sendEmailVerification();
      await this.updateProfile(user)
    } catch (error) {
      console.error("Error updating email in ProfileService:", error);
      throw error;
    }
  }

  // Add favorite idea to the investor's collection (Firebase Realtime Database)
  async addFavorite(ideaId: string): Promise<void> {
    try {
      const currentUserId = this.firebaseAuthService.getCurrentUser().uid;

      // Get the current user's profile
      const user = await this.firebaseDb.getUserById(currentUserId);

      // Add the ideaId to the investor's favorites list
      await this.firebaseDb.addFavorite(currentUserId, ideaId);

    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  // Remove favorite idea from the investor's collection (Firebase Realtime Database)
  async removeFavorite(ideaId: string): Promise<void> {
    try {
      const currentUserId = this.firebaseAuthService.getCurrentUser().uid;

      // Get the current user's profile
      const user = await this.firebaseDb.getUserById(currentUserId);

      // Remove the ideaId from the investor's favorites list
      await this.firebaseDb.removeFavorite(currentUserId, ideaId);

    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getFavorites(uid: string): Promise<string[]> {
    try {
      const userDb = await this.firebaseDb.getUserById(uid);

      // Return the list of favorite idea IDs (if any)
      return userDb.favorites || [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  }
}
