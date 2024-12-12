import { Routes } from '@angular/router';
import { addIdeaComponent } from './presentation/add-idea/add-idea.component';
import { RegisterComponent } from './presentation/register/register.component';
import { LoginComponent } from './presentation/login/login.component';
import { EditIdeaComponent } from './presentation/edit-idea/edit-idea.component';
import { ForgotPwdComponent } from './presentation/forgot-pwd/forgot-pwd.component';
import { DetailIdeaComponent } from './presentation/detail-idea/detail-idea.component';
import { ExplorePageComponent } from './presentation/explore-page/explore-page.component';
import { MyIdeasPageComponent } from './presentation/my-ideas-page/my-ideas-page.component';
import { ProfileComponent } from './presentation/profile/profile.component';



export const routes: Routes = [
    { path: 'register', component: RegisterComponent }, // Route for register component
    { path: 'login', component: LoginComponent }, //Route for login component
    { path: 'add-idea', component: addIdeaComponent }, // Route for add idea component
    { path: 'edit-idea/:id', component: EditIdeaComponent },
    { path: 'forgot-pwd', component: ForgotPwdComponent },
    { path: 'detail/:id', component: DetailIdeaComponent },
    { path: 'explorePage', component: ExplorePageComponent },
    { path: 'myIdeasPage', component: MyIdeasPageComponent },
    { path: 'profile', component: ProfileComponent }, // Route for profile component
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
]