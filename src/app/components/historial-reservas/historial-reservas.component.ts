import { Component, OnInit } from '@angular/core';
import { HistorialReservaService } from '../../services/historial-reserva.service';
import { HistorialReserva } from '../../Model/historial-reserva.model';

@Component({
  selector: 'app-historial-reservas',
  templateUrl: './historial-reservas.component.html',
  styleUrls: ['./historial-reservas.component.css']
})
export class HistorialReservasComponent implements OnInit {
  historialReservas: HistorialReserva[] = [];
  errorMessage: string = '';

  constructor(private historialReservaService: HistorialReservaService) {}

  ngOnInit(): void {
    this.historialReservaService.obtenerHistorialReservas().subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // Verificar la estructura completa
        this.historialReservas = data;
      },
      (error) => {
        this.errorMessage = 'Error al obtener el historial de reservas';
        console.error(error);
      }
    );
  }
  
  
  
  
}
