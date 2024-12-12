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
      //const userAuth = this.firebaseAuthService.getCurrentUser();
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
        userDb.description
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
      // Update email
      await this.firebaseAuthService.updateEmail(user.email);

      // Send email verification
      await this.firebaseAuthService.sendEmailVerification();

      // Update profile
      await this.updateProfile(user)
    } catch (error) {
      console.error("Error updating email in ProfileService:", error);
      throw error;
    }
  }
}
