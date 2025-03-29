import { Component, OnInit } from '@angular/core';
import { OpinionService } from '../../services/opinion.service';

@Component({
  selector: 'app-ver-opiniones',
  templateUrl: './ver-opiniones.component.html',
  styleUrls: ['./ver-opiniones.component.css']
})
export class VerOpinionesComponent implements OnInit {
  opiniones: any[] = [];
  filtros = {
    ecolodge_nombre: '',
    calificacion: '',
    orden: 'desc',
  };
  ecolodges: any[] = []; // Para almacenar los ecolodges obtenidos
  calificaciones: number[] = [1, 2, 3, 4, 5]; // Calificaciones posibles

  constructor(private opinionService: OpinionService) {}

  ngOnInit(): void {
    this.obtenerOpiniones();
    this.obtenerEcolodges();
  }

  obtenerOpiniones(): void {
    // Llamar al servicio para obtener las opiniones filtradas
    this.opinionService.filtrarOpiniones(this.filtros).subscribe(
      (data) => {
        this.opiniones = data;
        console.log(data); // Verifica que los datos se están obteniendo correctamente
      },
      (error) => {
        console.error('Error al obtener opiniones', error);
      }
    );
  }

  obtenerEcolodges(): void {
    // Obtener los ecolodges para llenar el autocompletado
    this.opinionService.obtenerEcolodges().subscribe(
      (data) => {
        this.ecolodges = data;
        console.log('Ecolodges:', data); // Verifica que los ecolodges se están obteniendo correctamente
      },
      (error) => {
        console.error('Error al obtener ecolodges', error);
      }
    );
  }

  onFiltrar(): void {
    // Llamar a obtenerOpiniones cuando se haga clic en "Filtrar"
    this.obtenerOpiniones();
  }
}
