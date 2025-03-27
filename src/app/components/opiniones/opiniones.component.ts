import { Component, OnInit } from '@angular/core';
import { OpinionService } from '../../services/opinion.service'; 
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-opiniones',
  templateUrl: './opiniones.component.html',
  styleUrls: ['./opiniones.component.css']
})
export class OpinionesComponent implements OnInit {
  opiniones: any[] = [];  

  opinionNueva = {
    ecolodge_id: null,    
    viajero_id: null,     
    calificacion: 0,
    comentario: '',
    ecolodge_nombre: '',  
    viajero_nombre: ''   
  };

  constructor(
    private opinionService: OpinionService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const ecolodgeId = params['ecolodgeId'];  // Usar ecolodgeId en lugar de reservaId
      const ecolodgeNombre = params['ecolodgeNombre'];
      const viajeroId = params['viajeroId'];
      const viajeroNombre = params['viajeroNombre'];  // Pasar el nombre del viajero

      // Asignar los valores a la nueva opinión
      this.opinionNueva.ecolodge_id = ecolodgeId;
      this.opinionNueva.viajero_id = viajeroId;
      this.opinionNueva.ecolodge_nombre = ecolodgeNombre;
      this.opinionNueva.viajero_nombre = viajeroNombre;
    });

    this.obtenerOpiniones();  
  }

  obtenerOpiniones() {
    this.opinionService.obtenerOpiniones().subscribe(
      (data: any) => {
        this.opiniones = data;  
      },
      (error) => {
        console.error('Error al obtener opiniones', error);  
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
      this.obtenerOpiniones();
      this.opinionNueva.comentario = '';
      this.opinionNueva.calificacion = 0;
    });
  }
}
