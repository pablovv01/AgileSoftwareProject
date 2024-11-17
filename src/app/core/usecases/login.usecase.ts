import { Injectable } from '@angular/core';
import { FirebaseAuthService } from '../../data/firebase_auth_service';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  constructor(private firebaseAuthService: FirebaseAuthService) { }

  async login(email: string, password: string): Promise<{ verified: boolean; uid?: string }> {
    try {
      const userCredential = await this.firebaseAuthService.loginUser(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        return { verified: true, uid: user.uid };
      } else {
        return { verified: false };
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.firebaseAuthService.sendPasswordResetEmail(email);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Error resetting password');
    }
  }
}
