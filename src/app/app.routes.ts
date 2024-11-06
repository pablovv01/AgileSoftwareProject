import { Routes } from '@angular/router';
import { RegisterComponent } from './presentation/register/register.component';
import { LoginComponent } from './presentation/login/login.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent }, // Route for register component
    {path: 'login', component: LoginComponent}, //Route for login component
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
]