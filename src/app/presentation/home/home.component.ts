import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { getDatabase, ref, push, set, update, query, get, orderByChild, equalTo } from 'firebase/database';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userId = sessionStorage.getItem('userId')!;
  userIdeas: any[] = [];
  ideas = [
    { title: 'Home', isActive: true },
    { title: 'About Us', isActive: false },
    { title: 'Services', isActive: false },
    { title: 'Contact', isActive: false }
  ];
  constructor(private router: Router){}

  ngOnInit() {
    this.loadUserIdeas();
  }

  async loadUserIdeas() {
    try {
      console.log(this.userId)
      this.userIdeas = await this.getUserIdeas(this.userId);
      console.log('User Ideas:', this.userIdeas);
    } catch (error) {
      console.error('Error loading user ideas:', error);
    }
  }

  goToAddPost(){
    this.router.navigate(['/add-idea']);
  }

  goToEditIdea(ideaId:any){
    this.router.navigate(['/edit-idea', ideaId]);
  }

  async getUserIdeas(userId: string): Promise<any[]> {
    try {
      // Get bbdd reference
      const db = getDatabase();
  
      // Build reference
      const ideasRef = ref(db, 'ideas');
      console.log("ideas ref")
      console.log(ideasRef)
  
      const userIdeasQuery = query(ideasRef);
  
      // Do consult
      const snapshot = await get(userIdeasQuery);
  
      if (snapshot.exists()) {
        console.log("entra")
        // Filter and map user id ideas
        // Get ideas from snapshot
        const userIdeas = snapshot.val();
        console.log(userIdeas)
        const ideasList = Object.keys(userIdeas).map(key => {
          const idea = userIdeas[key];

        // Verificar si el userId de la idea coincide con el userId actual
        if (idea.userId === userId) {
          return { id: key, ...idea };  // Add ID and all data to the idea
        } else {
          return null; 
        }
      }).filter(idea => idea !== null);  // Filter nulls
    
      console.log(ideasList);
      
      sessionStorage.setItem('ideas', JSON.stringify(ideasList)); //Save the user ideas list in session storage
      
      return ideasList;
        
      } else {
        console.log('No ideas found for this user.');
        return []; 
      }
    } catch (error) {
      console.error('Error fetching user ideas:', error);
      return []; 
    }
  }
}
