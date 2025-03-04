import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Importar las clases necesarias
import { ToastrService } from 'ngx-toastr';
import { EcolodgeService } from '../../services/ecolodge.service';

@Component({
  selector: 'app-ecolodge-form',
  templateUrl: './ecolodge-form.component.html',
  styleUrls: ['./ecolodge-form.component.css']
})
export class EcolodgeFormComponent implements OnInit {
  ecolodgeForm!: FormGroup;  // Usamos el operador "!" para indicar que no es nulo ni indefinido

  constructor(
    private ecolodgeService: EcolodgeService,
    private toastr: ToastrService,
    private fb: FormBuilder // Usar FormBuilder para crear el formulario
  ) {}

  ngOnInit() {
    this.ecolodgeForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(1)]],
      disponible: [false],
      paneles_solares: [false]
    });
  }

  saveEcolodge() {


    // Obtener el ID del usuario autenticado (esto puede depender de cómo gestionas la autenticación)
    const propietarioId = this.ecolodgeService.getUserId(); // Asegúrate de tener un servicio que te dé el ID del usuario autenticado
  
    
    // Agregar el propietario_id al objeto del formulario
    const ecolodgeData = {
      ...this.ecolodgeForm.value,
      propietario_id: Number(propietarioId)
    };
  
    console.log("Ecolodge Data:", ecolodgeData);
  
    if (this.ecolodgeForm.valid) {
      this.ecolodgeService.saveEcolodge(ecolodgeData).subscribe({
        next: (_response) => {
          this.toastr.success('Ecolodge guardado exitosamente');
          this.ecolodgeForm.reset();
        },
        error: (error) => {
          this.toastr.error('Error al guardar el ecolodge');
          console.error('Error al guardar el ecolodge:', error);
        }
      });
    } else {
      this.toastr.error('Formulario inválido');
    }
  }
  
}
