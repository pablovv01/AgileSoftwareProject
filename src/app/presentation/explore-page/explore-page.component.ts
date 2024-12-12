import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
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
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {ProfileUseCase} from '../../core/usecases/profile.usecase';




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
    MatMenuModule,
    FormsModule],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.css'
})
export class ExplorePageComponent implements AfterViewInit{
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
  selectedCategoriesFilter: string[] = [];
  selectedOrderFilter: string = ''
  isMenuOpen = false; // Variable que controla el estado del menú
  selectedSortOption: string = '';
  searchTitle:string = '';
  notFound: boolean = false;
  accountType: string | null = null;
  favouriteIdeas: Set<string> = new Set();  // Para trackear los ids de las ideas favoritas

  @ViewChild('filtersChips', { static: false }) chipsContainer!: ElementRef;
  showArrows: boolean = false;
  showClear: boolean = false;

  constructor(
    private router: Router,
    private ideaUseCase: IdeaUseCase,
    private profileUseCase: ProfileUseCase
  ) {
  }
  async ngOnInit() {
    this.getUserName()
    this.getAccountType()
    await this.loadFavorites();  // Carga los favoritos al iniciar para que salgan los corazones ya puestos.
    await this.loadPage()
  }

  ngAfterViewInit(): void {
    this.checkOverflow(); // Verificar en la carga inicial
  }

  loadBySortOption(option: string) {
    this.selectedSortOption = option;
    this.showClear = true;
    if(option === ""){
      this.showClear = false;
    }
    this.checkOverflow();
    this.reloadPage();
  }

  scrollLeft(): void {
    const container = this.chipsContainer.nativeElement;
    container.scrollLeft -= 100;
  }

  clearFilters(){
    this.selectedCategoriesFilter = [];
    this.loadBySortOption("");
    this.checkOverflow();
  }

  scrollRight(): void {
    const container = this.chipsContainer.nativeElement;
    container.scrollLeft += 100;
  }

  checkOverflow(): void {
    const container = document.querySelector('.filters-chips') as HTMLElement;

    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      this.showArrows = (isOverflowing && this.selectedCategoriesFilter.length > 0) || this.selectedSortOption != "";
    }
  }

  closeMenu(){
    this.isMenuOpen = false;
  }

  openMenu(){
    this.isMenuOpen = true;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleCategorySelection(category: any) {
    const index = this.selectedCategoriesFilter.indexOf(category.category);
    if (index === -1) {
      this.selectedCategoriesFilter.push(category.category);
    }else {
      this.selectedCategoriesFilter.splice(index, 1);
    }
    this.reloadPage()
    this.checkOverflow();
    this.showClear = true;
  }

  removeCategory(category: any) {
    this.categories = this.categories.filter(cat => cat !== category);
    this.selectedCategoriesFilter = this.selectedCategoriesFilter.filter(cat => cat !== category);
  }

  trackByCategory(index: number, category: any): string {
    return category.category;
  }

  getUserName(){
    this.userName = JSON.parse(sessionStorage.getItem('user') ?? '{}').name || null;
  }

  getAccountType() {
    this.accountType = JSON.parse(sessionStorage.getItem('user') ?? '{}').role || null;
    console.log(this.accountType)
  }


  isCreatedByMe(authorName: string, userID: string): boolean {
    return this.userName === authorName && this.userId === userID;
  }

  refreshButton(){
    this.clearFilters();
    this.searchTitle = ''
    this.loadPage();
  }

  reloadPage(){
    this.loadPage()
  }

  // Get color and tag for chips
  getCategoryColor(tag: string): string {
    const category = this.categories.find(c => c.category === tag);
    return category ? category.colorClass : ''; // Retorna la clase de color correspondiente
  }

  // Get icon for tag
  getCategoryIcon(tag: string): string {
    const category = this.categories.find(c => c.category === tag);
    return category ? category.icon : ''; // Retorna el icono correspondiente
  }

  async getAuthorIdeaName(userID: string): Promise<{name: string, photo: string }>{
    let authorName = userID
    let authorPhoto = "assets/userProfile_img.png"
    try {
      // Get author name of idea
      const user = await this.ideaUseCase.getUserIdeaName(userID);
      if (user.name) {
        authorName = user.name;
      }
      if(user.photo){
        authorPhoto = user.photo;
      }
    } catch (error) {
      console.error('Error loading user ideas:', error);
    }
    return {name: authorName, photo: authorPhoto};
  }
  searchByTitle() {
    //Clear other filters
    this.clearFilters();
    //Check empty input
    if (this.searchTitle === ""){
      Swal.fire({
        title: 'Search idea',
        text: 'Please enter a title to perform the search.',
        icon: 'warning',
        allowOutsideClick: false
      });
    }else{
      this.reloadPage()
    }
  }

  goToDetailIdea(idea: Idea) {
    //Add visualization
    idea.visualizations += 1;
    try{
      //Update field in data base
      this.ideaUseCase.updateIdeaVisualizations(idea);
    } catch (error) {
      console.error('Error updating visualizations:', error);
    }
    this.router.navigate(['/detail', idea.id]);
  }


  async favouriteIdea(ideaId: string): Promise<void> {
    try {
      if (this.favouriteIdeas.has(ideaId)) {
        // If already favorited, remove it
        await this.profileUseCase.removeFavorite(ideaId);
        await this.ideaUseCase.unlikeIdea(ideaId);
        this.favouriteIdeas.delete(ideaId);  // Remove from the set
      } else {
        // If not favorited, add it
        await this.profileUseCase.addFavorite(ideaId);
        await this.ideaUseCase.likeIdea(ideaId);
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

  private async loadFavorites() {
    try {
      const favorites = await this.profileUseCase.getFavorites(this.userId);
      this.favouriteIdeas = new Set(favorites);
      sessionStorage.setItem('favouriteIdeas', JSON.stringify(Array.from(this.favouriteIdeas)));  // Persist to sessionStorage
      console.log('Favorites loaded:', this.favouriteIdeas);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  private async loadPage() {
    try {
      this.isLoading = true;
      const response = await this.ideaUseCase.getIdeas(this.selectedCategoriesFilter, this.selectedSortOption, this.searchTitle);

      this.ideas = await Promise.all(
        response.ideas.map(async (idea) => {
          const user = await this.getAuthorIdeaName(idea.userId);
          return {...idea, authorName: user.name, authorPhoto: user.photo};
        })
      );
      this.notFound = (this.ideas.length === 0) ? true : false;
    } catch (error) {
      console.error('Error fetching paginated ideas:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
