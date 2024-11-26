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
  studentRole : string = 'student'
  investorRole : string = 'investor'
  
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger | undefined;

  constructor(private router: Router) {}

   ngOnInit(){
    this.getAccountType()
  }

  getAccountType(){
    this.accountType = JSON.parse(sessionStorage.getItem('user') ?? '{}').role || null;
  }

  // Check account type
  isStudent(): boolean {
    return this.accountType === this.studentRole;
  }

  isInvestor(): boolean {
    return this.accountType === this.investorRole;
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        sessionStorage.clear()
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
