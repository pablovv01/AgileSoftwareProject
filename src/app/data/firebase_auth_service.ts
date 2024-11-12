import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

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
}
