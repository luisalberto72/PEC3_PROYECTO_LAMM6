import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataserviceService } from '../../dataservice-service.service';
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
  nmbrPosts: number = 0;
  nbrFavourit: number = 0;
  user: any;
  Property: any;
  favProperty: any;
  createdProperty: boolean = false;
  profile: boolean = true;
  favouriteProperty: boolean = false;
  token: any = null;
  userId: number | null = null;
  selectedFile: File | null = null;

  profilePicturePreview: string | null = null; // Para la vista previa

  constructor(
    protected dataserv: DataserviceService,
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
      this.GetUserNumbers();
    

    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.router.navigate(['/login']);
    }
  }

  GetUserInfo(): void {
    console.log('userinfo3:', this.userId);
    if (!this.userId) return;
    console.log('userinfo1:', this.userId);
    this.dataserv.getUserInfo(this.userId).subscribe({
      next: (userinfo: any[]) => {
        console.log('Response from API:', userinfo); 
        const long = Object.keys(userinfo).length;
        console.log(long);
        if (long > 0) {
          this.user = userinfo;
          this.First_name = this.user.first_name;
          this.Last_name = this.user.last_name;
          this.Address = this.user.address;
          this.Nationality = this.user.nationality;
          this.Profile_pictures = this.user.profile_picture;
          this.Phone_number = this.user.phone_number;
          this.email = this.user.email;
          this.Gender = this.user.gender;
        } else {
          console.error('User info is empty or not an array');
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
  
    // Crear el objeto de datos del usuario
    const userData = {
      first_name: this.First_name,
      last_name: this.Last_name,
      address: this.Address,
      gender: this.Gender,
      nationality: this.Nationality,
      phone_number: this.Phone_number,
      email: this.email
    };
  
    // Crear FormData
    const formData = new FormData();
    
    // Agregar todos los campos del perfil
    formData.append('first_name', this.First_name);
    formData.append('last_name', this.Last_name);
    formData.append('address', this.Address);
    formData.append('gender', this.Gender);
    formData.append('nationality', this.Nationality);
    formData.append('phone_number', this.Phone_number);
    formData.append('email', this.email);
  
    // Agregar la imagen de perfil si se ha seleccionado una
    if (this.Profile_pictures instanceof File) {
      formData.append('profile_picture', this.Profile_pictures); // Agregar la imagen
    }
  
    // Enviar los datos al backend
    this.dataserv.updateUserProfile(formData, this.userId).subscribe({
      next: (response: any) => {
        this.toastr.success('Perfil actualizado correctamente');
        if (response.profile_picture) {
          this.Profile_pictures = response.profile_picture; // Actualizar la imagen mostrada
        }
        setTimeout(() => {
          window.location.reload(); // Recargar la página
        }, 1000); // Retraso opcional para mostrar la notificación antes de la recarga
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.toastr.error('Error al actualizar el perfil');
      }
    });
    
  }
  

 
  GetUserNumbers(): void {
    if (!this.userId) return;

    this.dataserv.GetUserPostsandfavourit(this.userId).subscribe({
      next: (data) => {
        this.nbrFavourit = data.nbrFavourite;
        this.nmbrPosts = data.nbrPosts;
      },
      error: (error) => {
        console.error('Error al obtener cantidad de publicaciones y favoritos:', error);
      }
    });
  }



  Delete(id: number): void {
    this.dataserv.Delete(id).subscribe({
      next: () => {
        this.GetUserNumbers();
        this.GetAllProperties();
        this.toastr.success('Propiedad eliminada correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar propiedad:', error);
        this.toastr.error('Error al eliminar la propiedad');
      }
    });
  }

  showPersonnelInfo(): void {
    this.createdProperty = false;
    this.profile = true;
    this.favouriteProperty = false;
  }

  showCreatedProperty(): void {
    this.createdProperty = true;
    this.profile = false;
    this.favouriteProperty = false;
    this.GetAllProperties();
  }

  showFavouriteProperty(): void {
    this.createdProperty = false;
    this.profile = false;
    this.favouriteProperty = true;
    
  }

  GetAllProperties(): void {
    if (!this.userId) return;

    this.dataserv.getUserProperties(this.userId).subscribe({
      next: (data) => {
        this.Property = data;
      },
      error: (error) => {
        console.error('Error al obtener propiedades:', error);
        this.toastr.error('Error al cargar las propiedades');
      }
    });
  }
}
