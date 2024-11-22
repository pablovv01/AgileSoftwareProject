import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './presentation/navigation-bar/navigation-bar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationBarComponent,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
})
export class AppComponent {
  constructor(private router: Router) {}

  // Check whether we should show the navigation bar or not. You can add more routes to exclude the bar here by the way.
  shouldShowNavBar(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return !hiddenRoutes.includes(this.router.url);
  }
}