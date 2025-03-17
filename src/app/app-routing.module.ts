import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { authGuard } from './AuthGuard/auth.guard.service';
import { EcolodgeFormComponent } from './components/ecolodge-form/ecolodge-form.component';  
import { EcolodgeListComponent } from './components/ecolodge-list/ecolodge-list.component';  
import { EditEcolodgeComponent } from './edit-ecolodge/edit-ecolodge.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'add-ecolodge', component: EcolodgeFormComponent, canActivate: [authGuard] },  // Ruta para agregar casas
  { path: 'list-ecolodges', component: EcolodgeListComponent },  // Ruta para listar casas
  { path: 'editar-ecolodge/:id', component: EditEcolodgeComponent },
  { path: '', component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
