import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { RentingListComponent } from './Pages/renting-list/renting-list.component';
import { CreateHouseComponent } from './Pages/crate-house/crate-house.component'; // Cambié CrateHouseComponent a CreateHouseComponent
import { PropertyDetaileComponent } from './Pages/peroperty-detaile/peroperty-detaile.component'; // Cambié PeropertyDetaileComponent a PropertyDetaileComponent
import { ProfileComponent } from './Pages/profile/profile.component';
import { authGuard } from './AuthGard/auth.guard.service';

const routes: Routes = [
  { path: 'Register', component: RegisterComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Explore', component: RentingListComponent },
  { path: 'AddHouse', component: CreateHouseComponent, canActivate: [authGuard] }, // Cambié CrateHouseComponent a CreateHouseComponent
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '', component: LandingPageComponent },
  { path: 'profile/AddHouse/:Id', component: CreateHouseComponent, canActivate: [authGuard] }, // Cambié CrateHouseComponent a CreateHouseComponent
  { path: 'Explore/Property/:Id', component: PropertyDetaileComponent, canActivate: [authGuard] }, // Cambié PeropertyDetaileComponent a PropertyDetaileComponent
  { path: 'profile/Property/:Id', component: PropertyDetaileComponent, canActivate: [authGuard] } // Cambié PeropertyDetaileComponent a PropertyDetaileComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
