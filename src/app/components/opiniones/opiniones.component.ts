import { Component, OnInit } from '@angular/core';
import { OpinionService } from '../../services/opinion.service'; // Asegúrate de importar el servicio adecuado

@Component({
  selector: 'app-opiniones',
  templateUrl: './opiniones.component.html',
  styleUrls: ['./opiniones.component.css']
})
export class OpinionesComponent implements OnInit {
  // Asegúrate de que la propiedad opiniones esté definida e inicializada
  opiniones: any[] = [];  // Aquí se almacenarán las opiniones

  opinionNueva = {
    ecolodge_id: null,  // ID del ecolodge
    viajero_id: null,   // ID del viajero
    calificacion: 0,
    comentario: '',
    ecolodge_nombre: '', // Nombre del ecolodge, solo para mostrar
    viajero_nombre: ''   // Nombre del viajero, solo para mostrar
  };

  constructor(private opinionService: OpinionService) {}

  ngOnInit() {
    this.obtenerOpiniones();  // Llamar al método para obtener las opiniones
  }

  // Método para obtener las opiniones
  obtenerOpiniones() {
    this.opinionService.obtenerOpiniones().subscribe(
      (data: any) => {
        this.opiniones = data;  // Asignar las opiniones al array opiniones
      },
      (error) => {
        console.error('Error al obtener opiniones', error);  // Manejar el error
      }
    );
  }

  seleccionarCalificacion(estrella: number) {
    this.opinionNueva.calificacion = estrella;
  }

  enviarOpinion() {
    const opinionData = {
      ecolodge_id: this.opinionNueva.ecolodge_id,
      viajero_id: this.opinionNueva.viajero_id,
      calificacion: this.opinionNueva.calificacion,
      comentario: this.opinionNueva.comentario
    };

    this.opinionService.enviarOpinion(opinionData).subscribe(response => {
      this.obtenerOpiniones(); // Recargar las opiniones después de enviar una nueva
      this.opinionNueva.comentario = ''; // Limpiar el comentario
      this.opinionNueva.calificacion = 0; // Limpiar la calificación
    });
  }
}
