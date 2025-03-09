import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../dataservice.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  First_name: string = '';
  Last_name: string = '';
  Address: string = '';
  Gender: string = '';
  Nationality: string = '';
  Profile_pictures: any; // Guarda la imagen seleccionada
  Phone_number: string = '';
  email: string = '';
  userId: number | null = null;
  token: any = null;
  profilePicturePreview: string | null = null; // Para la vista previa

  constructor(
    protected dataserv: DataService,
    private toastr: ToastrService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const storedToken = localStorage.getItem('user');
    if (!storedToken) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.token = jwt_decode(storedToken);  
      this.userId = this.token.sub;
      this.GetUserInfo();
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.router.navigate(['/login']);
    }
  }

  GetUserInfo(): void {
    if (!this.userId) return;
    this.dataserv.getUserInfo(this.userId).subscribe({
      next: (userinfo: any) => {
        if (userinfo) {
          this.First_name = userinfo.first_name;
          this.Last_name = userinfo.last_name;
          this.Address = userinfo.address;
          this.Nationality = userinfo.nationality;
          this.Profile_pictures = userinfo.profile_picture;
          this.Phone_number = userinfo.phone_number;
          this.email = userinfo.email;
          this.Gender = userinfo.gender;
        }
      },
      error: (error) => {
        console.error('Error al obtener información del usuario:', error);
        this.toastr.error('Error al cargar información del usuario');
        this.router.navigate(['/login']);
      }
    });
  }

  uploadimg(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.Profile_pictures = file;

      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ActualizarInformation(): void {
    if (!this.userId) return;

    const formData = new FormData();
    formData.append('first_name', this.First_name);
    formData.append('last_name', this.Last_name);
    formData.append('address', this.Address);
    formData.append('gender', this.Gender);
    formData.append('nationality', this.Nationality);
    formData.append('phone_number', this.Phone_number);
    formData.append('email', this.email);

    if (this.Profile_pictures instanceof File) {
      formData.append('profile_picture', this.Profile_pictures);
    }

    this.dataserv.updateUserProfile(formData, this.userId).subscribe({
      next: (response: any) => {
        this.toastr.success('Perfil actualizado correctamente');
        if (response.profile_picture) {
          this.Profile_pictures = response.profile_picture;
        }
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.toastr.error('Error al actualizar el perfil');
      }
    });
  }
}
