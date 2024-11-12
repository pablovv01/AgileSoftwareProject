import { Injectable } from '@angular/core';
import { FirebaseAuthService } from '../../data/firebase_auth_service';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  constructor(private firebaseAuthService: FirebaseAuthService) {}

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
}
