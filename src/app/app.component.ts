import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { DataService } from './dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  firstName: string = '';
  lastName: string = '';
  profilePicture: string = '';
  user: any;
  token: any;

  constructor(
    protected dataserv: DataService,
    private toastr: ToastrService,
    protected router: Router
  ) {}

  title = 'Ecolodges';
  expression = false;
  login = false;
  signin = false;
  Toke: any;

  ngOnInit() {
    this.LogedIn();
  }

  LogedIn() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.login = false;
      this.signin = false;
      this.expression = true;

      this.Toke = storedUser;
      console.log('Token:', this.Toke);  // Verifica el token almacenado

      this.token = jwt_decode(this.Toke);  // Decodifica el token
      console.log('Decoded Token:', this.token);  // Verifica el contenido del token

      const userId = this.token.sub;  // Extrae el user_id
      console.log('User ID:', userId);  // Verifica que el user_id esté presente

      if (userId) {
        this.dataserv.getUserInfo(userId).subscribe(
          (userinfo) => {
            console.log('User Info:', userinfo);  // Verifica la respuesta de la API
            console.dir(userinfo);  // Muestra la respuesta de la API en la consola

            if (userinfo) {  // Verifica que la respuesta contenga información
              this.user = userinfo;  // Asigna directamente el objeto userinfo
              this.firstName = this.user.first_name || '';
              this.lastName = this.user.last_name || '';
              this.profilePicture = this.user.profile_picture || '';  // Ajusta si es necesario
            } else {
              console.log('No user data found');
            }
          },
          (error) => {
            this.toastr.error('Error fetching user information.');
            console.error('API error:', error);  // Muestra el error si hay problemas con la API
          }
        );
      } else {
        console.log('No user_id found in token');
      }
    } else {
      this.login = true;
      this.signin = true;
      this.expression = false;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/Login']);
  }
}
