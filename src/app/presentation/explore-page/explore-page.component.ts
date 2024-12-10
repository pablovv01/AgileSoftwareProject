import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Idea } from '../../core/entities/idea';
import Swal from 'sweetalert2';
import { IdeaUseCase } from '../../core/usecases/idea.usecase';
import { CATEGORIES } from '../../core/entities/categoriesTag';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { ProfileUseCase } from '../../core/usecases/profile.usecase';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltip,
    MatProgressSpinnerModule,
    MatSelect,
    MatOption,
  ],
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css']
})
export class ExplorePageComponent {
  userId = sessionStorage.getItem('userId')!;
  userIdeas: Idea[] = [];
  categories = CATEGORIES;
  pageKeys: string[] = [];
  ideas: Idea[] = []; // Ideas visibles en la página actual
  totalItems = 0; // Número total de ideas
  pageSize = 6; // Tamaño de la página
  lastKey: string | undefined; // Clave del último registro cargado
  currentPage = 0; // Página actual
  isLoading: boolean = true;
  selectedOrder: string = ''; // Valor predeterminado
  selectedCategory: string = '';
  userName: string | null = null;
  accountType: string | null = null;
  favouriteIdeas: Set<string> = new Set();  // Track favourited idea IDs

  constructor(
    private router: Router, 
    private ideaUseCase: IdeaUseCase,
    private profileUseCase: ProfileUseCase // Inject ProfileUseCase
  ) { }

  ngOnInit() {
    this.getUserName()
    this.getAccountType()
    this.loadFavorites();  // Load favorites on initialization
    this.loadPage(this.currentPage, this.pageSize)
  }

  getUserName() {
    this.userName = JSON.parse(sessionStorage.getItem('user') ?? '{}').name || null;
  }

  getAccountType(){
    this.accountType = JSON.parse(sessionStorage.getItem('user') ?? '{}').role || null;
    console.log(this.accountType)
  }

  isCreatedByMe(authorName: string, userID: string): boolean {
    return this.userName === authorName && this.userId === userID;
  }

  private async loadFavorites() {
    try {
      const favorites = await this.profileUseCase.getFavorites(this.userId);  // Fetch the favorite ideas from the DB
      this.favouriteIdeas = new Set(favorites);  // Update the set of favorite ideas
      sessionStorage.setItem('favouriteIdeas', JSON.stringify(Array.from(this.favouriteIdeas)));  // Persist to sessionStorage
      console.log('Favorites loaded:', this.favouriteIdeas);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  reloadPage() {
    this.loadPage(this.currentPage, this.pageSize)
  }

  onPageChange(event: PageEvent): void {
    const { pageIndex, pageSize } = event;
    this.pageSize = pageSize;
    this.currentPage = pageIndex;
    this.loadPage(pageIndex, pageSize);
  }

  private async loadPage(pageIndex: number, pageSize: number): Promise<void> {
    try {
      this.isLoading = true;
      let startAfterKey: string | undefined;

      if (pageIndex > 0) {
        startAfterKey = this.pageKeys[pageIndex - 1]; // Usar la clave de la página anterior
      }
      const response = await this.ideaUseCase.getAllIdeas(pageSize, startAfterKey);

      // Si es una nueva página, guarda la clave
      if (pageIndex === this.pageKeys.length) {
        this.pageKeys.push(response.lastKey!);
      }

      // Obtener nombres de autores para cada idea
      this.ideas = await Promise.all(
        response.ideas.map(async (idea) => {
          const user = await this.getAuthorIdeaName(idea.userId); // Obtener el nombre del autor
          return { ...idea, authorName: user.name, authorPhoto: user.photo }; // Añadir `authorName` a cada idea
        })
      );
      this.totalItems = response.totalCount;
      this.currentPage = pageIndex;
    } catch (error) {
      console.error('Error fetching paginated ideas:', error);
    } finally {
      this.isLoading = false; // Desactivar el estado de carga
    }
  }

  // Función para obtener el color y clase según el tag
  getCategoryColor(tag: string): string {
    const category = this.categories.find(c => c.category === tag);
    return category ? category.colorClass : ''; // Retorna la clase de color correspondiente
  }

  // Función para obtener el icono correspondiente según el tag
  getCategoryIcon(tag: string): string {
    const category = this.categories.find(c => c.category === tag);
    return category ? category.icon : ''; // Retorna el icono correspondiente
  }

  async getAuthorIdeaName(userID: string): Promise<{ name: string, photo: string }> {
    let authorName = userID
    let authorPhoto = "assets/userProfile_img.png"
    try {
      // Llama al caso de uso para obtener el nombre del autor
      const user = await this.ideaUseCase.getUserIdeaName(userID);
      if (user.name) {
        authorName = user.name;
      }
      if (user.photo) {
        authorPhoto = user.photo;
      }
    } catch (error) {
      console.error('Error loading user ideas:', error);
    }
    return { name: authorName, photo: authorPhoto };
  }

  deleteIdea(ideaId: string) {
    Swal.fire({
      title: 'Delete idea',
      text: 'Are you sure you want to delete this idea? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.ideaUseCase.deleteIdea(ideaId);
          Swal.fire({
            title: 'Deleted!',
            text: 'The idea has been successfully deleted.',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          console.log(`Idea with ID ${ideaId} deleted successfully.`);
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
    });
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

  async favouriteIdea(ideaId: string): Promise<void> {
    try {
      if (this.favouriteIdeas.has(ideaId)) {
        // If already favorited, remove it
        await this.profileUseCase.removeFavorite(ideaId);
        this.favouriteIdeas.delete(ideaId);  // Remove from the set
      } else {
        // If not favorited, add it
        await this.profileUseCase.addFavorite(ideaId);
        this.favouriteIdeas.add(ideaId);  // Add to the set
      }
  
      console.log(`Idea with ID ${ideaId} marked as favourite: ${this.favouriteIdeas.has(ideaId)}`);
    } catch (error) {
      console.error('Error handling favourite idea:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an issue with favouriting the idea. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      });
    }
  }
}