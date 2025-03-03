import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from '../../dataservice-service.service';
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
    protected dataserv: DataserviceService,
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
          this.data = res;
          if (this.data.status === 1) {
            // Almacena el token y la información del usuario
            localStorage.setItem('user', this.data.data.token);
            localStorage.setItem('first_name', this.data.data.first_name);
            localStorage.setItem('last_name', this.data.data.last_name);
            localStorage.setItem('email', this.data.data.email);

            this.toastr.success('Login Successful');
            this.router.navigate(['/Explore']); // Redirige a Explore
          } else {
            this.toastr.warning('Email or Password Incorrect!');
          }
        },
        error: (error) => {
          this.toastr.error('An error occurred during login. Please try again later.');
        },
      });
    }
  }
}
