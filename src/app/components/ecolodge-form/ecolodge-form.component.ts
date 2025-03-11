import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EcolodgeService } from '../../services/ecolodge.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ecolodge-form',
  templateUrl: './ecolodge-form.component.html',
  styleUrls: ['./ecolodge-form.component.css']
})
export class EcolodgeFormComponent implements OnInit {
  selectedImages: any[] = []; // Almacena las imágenes seleccionadas
  propietarioId: number | null = null;
  token: any = null;
  ecolodgeForm!: FormGroup; // Aseguramos que es FormGroup y no undefined

  constructor(
    private ecolodgeService: EcolodgeService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.initForm();  // Inicializamos el formulario
  }

  private loadUserInfo(): void {
    const storedToken = localStorage.getItem('user');
    if (!storedToken) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.token = jwt_decode(storedToken);
      this.propietarioId = this.token.sub;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.router.navigate(['/login']);
    }
  }

  private initForm(): void {
    this.ecolodgeForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(1)]], // Aseguramos que el precio sea mayor que 0
      energia_renovable: [false],
      paneles_solares: [false]
    });
  }

  // Método para manejar la selección de imágenes
  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImages = Array.from(event.target.files); // Guardar las imágenes seleccionadas
    }
  }

  saveEcolodge() {
    if (!this.propietarioId) {
      this.toastr.error('Error: No se encontró el ID del usuario.');
      return;
    }

    if (this.ecolodgeForm.invalid) {
      this.toastr.error('Por favor complete todos los campos requeridos.');
      return;
    }

    const formData = new FormData();
    
    // Usar valores del FormGroup directamente
    formData.append('nombre', this.ecolodgeForm.get('nombre')?.value);
    formData.append('descripcion', this.ecolodgeForm.get('descripcion')?.value);
    formData.append('ubicacion', this.ecolodgeForm.get('ubicacion')?.value);
    formData.append('precio', this.ecolodgeForm.get('precio')?.value.toString());
    formData.append('energia_renovable', this.ecolodgeForm.get('energia_renovable')?.value ? '1' : '0');
    formData.append('paneles_solares', this.ecolodgeForm.get('paneles_solares')?.value ? '1' : '0');
    formData.append('propietario_id', this.propietarioId?.toString() || '');

    // Agregar imágenes al FormData
    this.selectedImages.forEach((file) => {
      formData.append('imagenes[]', file); // Usamos 'imagenes[]' para enviar varias imágenes
    });

    this.ecolodgeService.saveEcolodge(formData).subscribe({
      next: (_response) => {
        this.toastr.success('Ecolodge guardado exitosamente');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al guardar el ecolodge:', error);
        this.toastr.error('Error al guardar el ecolodge');
      }
    });
  }

  // Resetear formulario y limpiar imágenes seleccionadas
  private resetForm() {
    this.ecolodgeForm.reset();
    this.selectedImages = [];
  }
}
