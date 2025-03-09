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
  ecolodgeForm: FormGroup | undefined;
  ecolodge: any;

  constructor(
    private route: ActivatedRoute,
    private ecolodgeService: EcolodgeService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    this.ecolodgeId = id ? +id : undefined; // Convertimos el valor a número o undefined si no es válido
    console.log('Ecolodge ID:', this.ecolodgeId);

    // Verificar si ecolodgeId es válido
    if (this.ecolodgeId === undefined) {
      console.error('ID del ecolodge no es válido');
      this.router.navigate(['/ecolodges']); // Redirigir al listado de ecolodges si el ID no es válido
      return;
    }

    // Inicializar el formulario
    this.ecolodgeForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: [''],
      price_per_night: ['', [Validators.required, Validators.min(0)]],
      has_solar_panels: [false],
      is_available: [false]
    });

    // Obtener datos del ecolodge desde el servicio
    this.getEcolodgeData();
  }

  getEcolodgeData(): void {
    if (this.ecolodgeId !== undefined) {
      this.ecolodgeService.getEcolodgeById(this.ecolodgeId).subscribe(
        (data) => {
          this.ecolodge = data;
          // Asegurarnos de que ecolodge no sea undefined antes de usarlo
          if (this.ecolodge) {
            this.ecolodgeForm?.patchValue(this.ecolodge); // Asegurarnos de que el formulario está definido
          }
        },
        (error) => {
          console.error('Error al obtener el ecolodge', error);
        }
      );
    }
  }

  // Enviar el formulario de edición
  onSubmit(): void {
    if (this.ecolodgeForm?.valid) { // Asegurarnos de que el formulario está definido
      if (this.ecolodgeId !== undefined) {
        this.ecolodgeService.updateEcolodge(this.ecolodgeId, this.ecolodgeForm.value).subscribe(
          (response) => {
            console.log('Ecolodge actualizado', response);
            this.router.navigate(['/ecolodges']);
          },
          (error) => {
            console.error('Error al actualizar el ecolodge', error);
          }
        );
      }
    } else {
      console.log('Formulario no válido');
    }
  }
}
