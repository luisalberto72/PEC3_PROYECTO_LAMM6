import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcolodgeService } from '../services/ecolodge.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-ecolodge',
  templateUrl: './edit-ecolodge.component.html',
  styleUrls: ['./edit-ecolodge.component.css']
})
export class EditEcolodgeComponent implements OnInit {
  ecolodgeId: number | undefined;
  ecolodgeForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],  // Cambiar 'name' por 'nombre'
    ubicacion: ['', [Validators.required]],  // Cambiar 'location' por 'ubicacion'
    descripcion: [''],
    precio: ['', [Validators.required, Validators.min(0)]],
    paneles_solares: [false],
    energia_renovable: [false]
  });

  ecolodge: any;
  errorMessage: string | undefined;
  isSubmitting: boolean | undefined;

  constructor(
    private route: ActivatedRoute,
    private ecolodgeService: EcolodgeService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ecolodgeId = id ? +id : undefined;

    if (this.ecolodgeId === undefined) {
      this.router.navigate(['/ecolodges']);
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
            // Ajusta los nombres de los campos en el formulario a los del backend
            this.ecolodgeForm.patchValue({
              nombre: this.ecolodge.nombre,  // Cambiar 'name' por 'nombre'
              ubicacion: this.ecolodge.ubicacion,  // Cambiar 'location' por 'ubicacion'
              descripcion: this.ecolodge.descripcion,
              precio: this.ecolodge.precio,
              paneles_solares: Boolean(this.ecolodge.paneles_solares),
              energia_renovable: Boolean(this.ecolodge.energia_renovable)
            });
          }
        },
        (error) => {
          console.error('Error al obtener el ecolodge', error);
          this.router.navigate(['/ecolodges']);
        }
      );
    }
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
