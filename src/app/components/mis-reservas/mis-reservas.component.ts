import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { EcolodgeService } from '../../services/ecolodge.service';
import { DataService } from '../../dataservice.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  reservas: any[] = [];
  userId: number = 0; // Asegurar que es un número válido
  usuarioLogueado: any;

  constructor(
    private reservaService: ReservaService,
    private ecolodgeService: EcolodgeService,
    private dataService: DataService,  // Inyectamos el DataService aquí
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
          console.log("Reservas cargadas:", data);  // Verifica en la consola si ecolodge_id está presente
          this.reservas = data;
        },
        (error) => {
          console.error('Error al obtener reservas', error);
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

  valorarReserva(reserva: any): void {
    console.log("Reserva seleccionada para valorar:", reserva);
    
    if (!reserva || !reserva.ecolodge_id || !reserva.viajero_id) {
      console.error("Error: La reserva es inválida o no tiene un ecolodge_id o viajero_id", reserva);
      return;
    }
  
    const viajeroId = reserva.viajero_id;
  
    // Llamada al servicio para obtener los datos del usuario
    this.dataService.getUserInfo(viajeroId).subscribe(
      (usuario: { first_name: string; last_name: string }) => {
        if (!usuario || !usuario.first_name || !usuario.last_name) {
          console.error("Error: Los datos del usuario son incompletos", usuario);
          return;
        }
  
        const viajeroNombre = usuario.first_name + ' ' + usuario.last_name;
        console.log('Nombre del viajero:', viajeroNombre);
  
        // Navegar a la página de opiniones con los parámetros necesarios
        this.router.navigate(['/opiniones'], {
          queryParams: {
            ecolodgeId: reserva.ecolodge_id,
            ecolodgeNombre: reserva.nombre_ecolodge,
            viajeroId: viajeroId,
            viajeroNombre: viajeroNombre
          }
        });
      },
      (error: any) => {
        console.error("Error al obtener la información del usuario:", error);
        alert("Hubo un error al obtener la información del viajero. Inténtalo más tarde.");
      }
    );
  }
  
}

