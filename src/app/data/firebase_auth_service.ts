import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, UserCredential, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword, User, onAuthStateChanged, updateEmail } from 'firebase/auth';
import { authentication } from '../../main';
import { FirebaseError } from 'firebase/app';
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

  // Performs login operation
  loginUserAlex(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Performs login operation
  async loginUser(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(authentication, email, password);

      // Espera a que Firebase sincronice el estado del usuario
      const user = await new Promise<User | null>((resolve) => {
        onAuthStateChanged(authentication, resolve);
      });

      if (!user) {
        throw new Error('Failed to retrieve the authenticated user');
      }

      console.log('User signed in successfully:', user);
      return userCredential;
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
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

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser()

    try {
      const credential = EmailAuthProvider.credential(user.email!, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      console.log('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  getCurrentUser(): User {
    const user = authentication.currentUser;

    if (!user) {
      throw new Error('No user is authenticated');
    }
    return user
  }

  // Update the user's email
  async updateEmail(newEmail: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateEmail(user, newEmail);
      } catch (error) {
        console.error("Error updating email:", error);
        throw error;
      }
    } else {
      throw new Error("No authenticated user found.");
    }
  }

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        console.error("Error sending email verification:", error);
        throw error;
      }
    } else {
      throw new Error("No authenticated user found.");
    }
  }
}
