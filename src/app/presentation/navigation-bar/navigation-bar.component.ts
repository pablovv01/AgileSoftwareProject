import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navigation-bar',
  templateUrl: './navigation-bar.component.html',
  standalone: true,
  styleUrls: ['./navigation-bar.component.css'],
  imports: [RouterModule, CommonModule],
})
export class NavigationBarComponent implements OnInit {
  accountType: string | null = null; 

  constructor(private router: Router) {}

 async ngOnInit(): Promise<void> {
    await this.fetchAccountType();
  }

  async fetchAccountType(): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        
        // Wait for the snapshot
        const snapshot = await get(userRef);
  
        if (snapshot.exists()) {
          const userData = snapshot.val();
          this.accountType = userData.type; 
          console.log('Account Type:', this.accountType);
        } else {
          console.error('No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
