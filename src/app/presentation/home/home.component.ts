import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { get, getDatabase, ref, remove } from 'firebase/database';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import { Idea } from '../../core/entities/idea';
import Swal from 'sweetalert2';

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
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userId = sessionStorage.getItem('userId')!;
  userIdeas: Idea[] = [];

  ideas = [
    { title: 'Home', isActive: true },
    { title: 'About Us', isActive: false },
    { title: 'Services', isActive: false },
    { title: 'Contact', isActive: false }
  ];

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadUserIdeas();
  }

  async loadUserIdeas() {
    try {
      console.log(this.userId);
      this.userIdeas = await this.getUserIdeas(this.userId);
      console.log('User Ideas:', this.userIdeas);
    } catch (error) {
      console.error('Error loading user ideas:', error);
    }
  }

  deleteIdea(ideaId: any) {
    Swal.fire({
      title: 'Delete idea',
      text: 'Are you sure you want to delete this idea? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,  // Muestra el botón de "No"
      confirmButtonText: 'Yes',  // Botón de "Yes"
      cancelButtonText: 'No',    // Botón de "No"
      reverseButtons: true,      // Cambia la posición de los botones (No a la izquierda y Yes a la derecha)
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteIdeaFromBBDD(ideaId);
      }
    });
  }

  async deleteIdeaFromBBDD(ideaId: string) {
    try {
      const db = getDatabase();
      const ideaRef = ref(db, `ideas/${ideaId}`);
      await remove(ideaRef);
      Swal.fire({
        title: 'Deleted!',
        text: 'The idea has been successfully deleted.',
        icon: 'success',
        confirmButtonText: 'Ok',
        allowOutsideClick: false  // Evita que el usuario cierre la alerta fuera de la ventana
      });
      console.log(`Idea with ID ${ideaId} deleted successfully.`);

      // Update the local userIdeas array to reflect the deletion
      this.userIdeas = this.userIdeas.filter(idea => idea.id !== ideaId);

    } catch (error) {
      console.error('Error deleting idea:', error);
      Swal.fire({
        title: 'Delete error',
        text: 'There was an issue deleting the idea. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      });
    }
  }

  goToAddPost() {
    this.router.navigate(['/add-idea']);
  }

  goToEditIdea(ideaId: any) {
    this.router.navigate(['/edit-idea', ideaId]);
  }

  goToDetailIdea(ideaId: any) {
    this.router.navigate(['/detail', ideaId]);
  }

  async getUserIdeas(userId: string): Promise<Idea[]> {
    try {
      const db = getDatabase();
      const ideasRef = ref(db, 'ideas');
      const snapshot = await get(ideasRef);

      if (snapshot.exists()) {
        const userIdeas = snapshot.val();
        const ideasList = Object.keys(userIdeas).map(key => {
          const idea = userIdeas[key];
          if (idea.userId === userId) {
            return { id: key, ...idea };
          } else {
            return null;
          }
        }).filter(idea => idea !== null);

        sessionStorage.setItem('ideas', JSON.stringify(ideasList));
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