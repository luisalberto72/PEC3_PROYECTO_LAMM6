import { Component } from '@angular/core';
import { DataserviceService } from '../../dataservice-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(
    protected router: Router,
    protected dataserv: DataserviceService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  data: any;
  user: any;

  submit(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    passwordConfirm: string,
    address: string,
    gender: string,
    nationality: string,
    phone_number: string,
    role: string // role será 'owner' o 'traveler'
  ) {
    if (passwordConfirm !== password) {
      this.toastr.info('Passwords do not match');
    } else if (
      first_name === '' ||
      last_name === '' ||
      email === '' ||
      password === '' ||
      passwordConfirm === '' ||
      address === '' ||
      gender === '' ||
      nationality === '' ||
      phone_number === '' ||
      role === ''
    ) {
      this.toastr.info('Please enter all information');
    } else {
      this.user = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'address': address,
        'gender': gender,
        'nationality': nationality,
        'phone_number': phone_number,
        'role': role // Enviamos el rol también
      };

      console.log(this.user);

      // Llamada al servicio para registrar al usuario
      this.dataserv.registerUser(this.user).subscribe(res => {
        this.data = res;
        if (res === 0) {
          this.toastr.error('Email already registered');
        } else {
          this.toastr.success('Register successfully');
          this.router.navigate(['/Login']);
        }
      });
    }
  }
}
