import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu'; // Import MatMenuTrigger

@Component({
  selector: 'navigation-bar',
  templateUrl: './navigation-bar.component.html',
  standalone: true,
  styleUrls: ['./navigation-bar.component.css'],
  imports: [RouterModule, CommonModule, MatMenuModule, MatButtonModule],
})
export class NavigationBarComponent implements OnInit {
  accountType: string | null = null;
  
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger | undefined;

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

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  // Add a method to detect when the menu opens or closes
  onMenuOpened(): void {
    const profileContainer = document.querySelector('.profile-container') as HTMLElement;
    profileContainer?.classList.add('menu-open');
  }

  onMenuClosed(): void {
    const profileContainer = document.querySelector('.profile-container') as HTMLElement;
    profileContainer?.classList.remove('menu-open');
  }
}
