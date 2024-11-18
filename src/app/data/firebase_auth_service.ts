import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, UserCredential, sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private auth = getAuth();

  constructor() { }

  // Register the user
  registerUser(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Sends verification email to the user registered
  sendEmailVerification(user: any): Promise<void> {
    return sendEmailVerification(user);
  }

  // Performs login operation
  loginUser(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Send Password Reset Email
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent successfully.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Error sending password reset email');
    }
  }
}
