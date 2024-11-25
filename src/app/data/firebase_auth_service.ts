import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, UserCredential, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword, User, onAuthStateChanged, updateEmail } from 'firebase/auth';
import { authentication } from '../../main';
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

  updateEmail(newEmail: string) {
    try {
      if (this.auth.currentUser)
        updateEmail(this.auth.currentUser, newEmail)
    }
    catch (error) {
      throw error
    }
  }
}
