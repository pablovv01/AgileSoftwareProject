import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { FirebaseAuthService } from '../../data/firebase_auth_service';
import { FirebaseDbService } from '../../data/firebase_db_service';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCase {
  constructor(private firebaseAuthService: FirebaseAuthService, private firebaseDb: FirebaseDbService) { }

  async registerUser(user: User, password: string): Promise<void> {
    try {
      // Register user in Firebase Authentication
      const userCredential = await this.firebaseAuthService.registerUser(user.email, password);
      const userId = userCredential.user.uid;

      // Send verification email
      await this.firebaseAuthService.sendEmailVerification();

      // Save data in db
      await this.firebaseDb.saveUserData(userId, user);

    } catch (error) {
      console.error('Error in register use case: ', error);
      throw error;
    }
  }
}