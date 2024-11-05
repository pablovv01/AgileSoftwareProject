import { Routes } from '@angular/router';
import { RegisterComponent } from './presentation/register/register.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent }, // Ruta para el componente de registro
    { path: '', redirectTo: '/', pathMatch: 'full' }, // Ruta por defecto
]