import { Routes } from '@angular/router';
import { addIdeaComponent } from './presentation/add-idea/add-idea.component';

export const routes: Routes = [
    { path: 'add-idea', component: addIdeaComponent }, // Route for register component
    { path: '', redirectTo: '/add-idea', pathMatch: 'full' }, // Default route
]