import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcolodgeService } from '../../services/ecolodge.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-ecolodge',
  templateUrl: './edit-ecolodge.component.html',
  styleUrls: ['./edit-ecolodge.component.css']
})
export class EditEcolodgeComponent implements OnInit {
  ecolodgeId: number | undefined;
  ecolodgeForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    ubicacion: ['', [Validators.required]],
    descripcion: [''],
    precio: ['', [Validators.required, Validators.min(0)]],
    paneles_solares: [false],
    energia_renovable: [false],
    imagenes: [[], [Validators.required]]  // Asegurarse de que este campo sea obligatorio
  });

  ecolodge: any;
  images: any[] = [];  // Array para almacenar las imágenes subidas
  errorMessage: string | undefined;
  isSubmitting: boolean | undefined;

  constructor(
    private route: ActivatedRoute,
    private ecolodgeService: EcolodgeService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
 
    const id = this.route.snapshot.paramMap.get('id');
    this.ecolodgeId = id ? +id : undefined;

    if (this.ecolodgeId === undefined) {
      this.router.navigate(['/add-ecolodge']);
      return;
    }

    this.getEcolodgeData();
  }

  getEcolodgeData(): void {
    if (this.ecolodgeId !== undefined) {
      this.ecolodgeService.getEcolodgeById(this.ecolodgeId).subscribe(
        (data) => {
          this.ecolodge = data;
          if (this.ecolodge) {
            // Ajustar los campos del formulario
            this.ecolodgeForm.patchValue({
              nombre: this.ecolodge.nombre,
              ubicacion: this.ecolodge.ubicacion,
              descripcion: this.ecolodge.descripcion,
              precio: this.ecolodge.precio,
              paneles_solares: Boolean(this.ecolodge.paneles_solares),
              energia_renovable: Boolean(this.ecolodge.energia_renovable)
            });

            // Cargar las imágenes asociadas
            this.images = this.ecolodge.imagenes || [];  // Asegúrate de que las imágenes estén en el formato adecuado
            this.ecolodgeForm.patchValue({
              imagenes: this.images  // Actualizar campo de imágenes en el formulario
            });
          }
        },
        (error) => {
          console.error('Error al obtener el ecolodge', error);
          this.router.navigate(['/add-ecolodge']);
        }
      );
    }
  }

  onImageSelected(event: any) {
    if (!this.ecolodgeId) {
      console.error('No se encontró el ID del ecolodge');
      return;
    }
  
    const files = event.target.files;
    const formData = new FormData();
  
    // Añadir cada archivo a FormData
    for (let i = 0; i < files.length; i++) {
      formData.append('images[]', files[i]);  // Usamos 'images[]' para múltiples imágenes
    }
  
    // Subir las imágenes al backend con el ID dinámico
    this.http.post(`http://localhost:8000/api/ecolodges/${this.ecolodgeId}/image`, formData).subscribe(
      (response: any) => {
        console.log('Imágenes subidas:', response);
        this.images = response.images;
        this.ecolodgeForm.patchValue({ imagenes: this.images });
      },
      (error: any) => {
        console.error('Error al subir las imágenes:', error);
      }
    );
  }

  onSubmit() {
    console.log('Formulario antes de enviar:', this.ecolodgeForm.value);  // Verifica los valores
    if (!this.ecolodgeForm.valid) {
      console.error('Formulario inválido');
      return;
    }

    if (this.ecolodgeId === undefined) {
      console.error('ID del ecolodge no está definido');
      this.router.navigate(['/add-ecolodge']);
      return;
    }

    this.isSubmitting = true;
    this.ecolodgeService.updateEcolodge(this.ecolodgeId, this.ecolodgeForm.value).subscribe(
      () => {
        this.isSubmitting = false;
        this.router.navigate(['/list-ecolodges']);
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Error al actualizar el ecolodge:', error);
        if (error.error.errors) {
          // Mostrar errores específicos
          this.errorMessage = Object.values(error.error.errors).join(', ');
        } else {
          this.errorMessage = 'Error al actualizar el ecolodge. Inténtalo de nuevo más tarde.';
        }
      }
    );
  }
}
