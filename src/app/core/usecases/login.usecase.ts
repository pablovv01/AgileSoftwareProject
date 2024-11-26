import { Injectable } from '@angular/core';
import { FirebaseAuthService } from '../../data/firebase_auth_service';
import { FirebaseDbService } from '../../data/firebase_db_service';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  constructor(private firebaseAuthService: FirebaseAuthService, private firebaseDb: FirebaseDbService) { }

  async login(email: string, password: string): Promise<{ verified: boolean; uid?: string }> {
    try {
      const userCredential = await this.firebaseAuthService.loginUser(email, password);
      const user = userCredential.user;
      console.log(user)

      if (user.emailVerified) {
        const snapshot = await this.firebaseDb.getUserSession(user.uid);

        let userData = null;
        if (snapshot.exists()) {
        userData = snapshot.val();
        }
        sessionStorage.setItem('user', JSON.stringify({uid: user.uid, email: user.email, role: userData.type, name: userData.name + " " + userData.surname}));
        return { verified: true, uid: user.uid };
        
      } else {
        return { verified: false };
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async loginAlex(email: string, password: string):Promise<{ 
    verified: boolean; 
    uid?: string; 
    userData?: any 
  }> {
    try {
      const userCredential = await this.firebaseAuthService.loginUserAlex(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
         // Obtener datos adicionales del usuario desde la base de datos
        const snapshot = await this.firebaseDb.getUserSession(user.uid);

        let userData = null;
        if (snapshot.exists()) {
        userData = snapshot.val();
      }     
        return { verified: true, uid: user.uid, userData };
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
