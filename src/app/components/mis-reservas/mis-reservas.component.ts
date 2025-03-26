import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { EcolodgeService } from '../../services/ecolodge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  reservas: any[] = [];
  userId: number = 0; // Asegurar que es un número válido

  constructor(
    private reservaService: ReservaService,
    private ecolodgeService: EcolodgeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.ecolodgeService.getUserId() ?? 0; // Manejo de null con operador ?? (Si es null se asigna 0)
    if (this.userId > 0) {
      this.cargarReservas();  // Si el ID de usuario es válido, cargar las reservas
    } else {
      console.error('Error: No se pudo obtener el ID del usuario.');
    }
  }

  cargarReservas(): void {
    if (this.userId > 0) {
      this.reservaService.obtenerReservasUsuario(this.userId).subscribe(
        (data) => {
          this.reservas = data; // Cargar las reservas del usuario
        },
        (error) => {
          console.error('Error al obtener reservas', error); // Manejar posibles errores al obtener las reservas
        }
      );
    }
  }

  cancelarReserva(reservaId: number, fechaInicio: string, fechaFin: string): void {
    const hoy = new Date().toISOString().split('T')[0];
  
    if (fechaInicio <= hoy) {
      alert('No puedes cancelar la reserva porque ya ha comenzado.');
      return;
    }
  
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      this.reservaService.cancelarReserva(reservaId).subscribe(
        () => {
          alert('Reserva cancelada correctamente.');
          this.cargarReservas();
        },
        (error) => {
          console.error('Error al cancelar la reserva', error);
        }
      );
    }
  }
  

  puedeValorar(fechaFin: string): boolean {
    const hoy = new Date();
    const fechaFinReserva = new Date(fechaFin);
    return hoy > fechaFinReserva;  // Solo se puede valorar si la fecha de fin ya pasó
  }

  valorarReserva(reservaId: number): void {
    this.router.navigate(['/opiniones', reservaId]);  // Redirige al usuario a la página de opiniones para esa reserva
  }
}
