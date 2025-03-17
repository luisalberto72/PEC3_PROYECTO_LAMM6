import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  firstName: string | null = '';
  lastName: string | null = '';
  email: string | null = '';
  user: any;
  data: any;

  constructor(
    protected functionhome: AppComponent,
    protected toastr: ToastrService,
    protected dataserv: DataService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.functionhome.ngOnInit(); // Inicializa lógica global si es necesario
    this.firstName = localStorage.getItem('first_name') || '';
    this.lastName = localStorage.getItem('last_name') || '';
    this.email = localStorage.getItem('email') || '';
  }

  submit(useremail: string, userpass: string) {
    if (!useremail || !userpass) {
      this.toastr.info('Email and Password required');
    } else {
      this.user = {
        email: useremail,
        password: userpass,
      };
      this.dataserv.loginUser(this.user).subscribe({
        next: (res) => {
          console.log('Respuesta de la API:', res);  // Verifica toda la respuesta de la API
          this.data = res;
          if (this.data.status === 1) {
            console.log('Login exitoso');
            console.log('Rol del usuario:', this.data.data.role);  // Verifica el rol aquí
            localStorage.setItem('user', this.data.data.token);
          
            this.router.navigate(['']);
           
          } else {
            console.log('Email o contraseña incorrectos');
            this.toastr.warning('Email or Password Incorrect!');
          }
        },
        error: (error) => {
          console.error('Error en la API:', error);
          this.toastr.error('Error en la autenticación. Inténtalo más tarde.');
        }
      });
    }
  }
  
}