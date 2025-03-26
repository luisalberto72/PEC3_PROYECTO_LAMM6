import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { HomePageComponent } from './Pages/home-page/home-page.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ProfileComponent } from './Pages/profile/profile.component';
import { EcolodgeFormComponent } from './components/ecolodge-form/ecolodge-form.component';
import { EcolodgeListComponent } from './components/ecolodge-list/ecolodge-list.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { DataService } from './dataservice.service';
import { EditEcolodgeComponent } from './components/edit-ecolodge/edit-ecolodge.component';
import { SearchEcolodgesComponent } from './components/search-ecolodges/search-ecolodges.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { OpinionesComponent } from './components/opiniones/opiniones.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomePageComponent,
    ProfileComponent,
    EcolodgeFormComponent,
    EcolodgeListComponent,
    EditEcolodgeComponent,
    SearchEcolodgesComponent,
    ReservaComponent,
    MisReservasComponent,
    OpinionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  providers: [
   
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('802651425260-1l7rb297u2okomuqb368g7l71r3sbmsv.apps.googleusercontent.com')
          }
        ],
        onError: (err) => console.error(err)
      } as SocialAuthServiceConfig
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DataService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
