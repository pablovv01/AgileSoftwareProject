import { Routes } from '@angular/router';
import { addIdeaComponent } from './presentation/add-idea/add-idea.component';
import { RegisterComponent } from './presentation/register/register.component';
import { LoginComponent } from './presentation/login/login.component';
import { HomeComponent } from './presentation/home/home.component';
import { EditIdeaComponent } from './presentation/edit-idea/edit-idea.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent }, // Route for register component
    { path: 'login', component: LoginComponent }, //Route for login component
    { path: 'add-idea', component: addIdeaComponent }, // Route for add idea component
    { path: 'home', component: HomeComponent}, // Route for home component
    { path: 'edit-idea/:id', component: EditIdeaComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
]