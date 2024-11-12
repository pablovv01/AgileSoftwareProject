import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private auth = getAuth();

  constructor() {}

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
}
