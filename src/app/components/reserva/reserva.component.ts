import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';  
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  ecolodge: any = null;
  imagenes: any[] = [];  
  fechaInicio!: string;
  fechaFin!: string;
  precioTotal: number = 0;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener usuario autenticado
    this.currentUser = this.reservaService.getCurrentUser(); 
    console.log("current",this.currentUser);

    if (!this.currentUser || !this.currentUser.sub) {
      this.toastr.error('Debes iniciar sesión para reservar.');
      this.router.navigate(['/login']);
      return;
    }

    // Obtener ecolodge desde los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const ecolodgeData = params['ecolodge'];
      if (ecolodgeData) {
        this.ecolodge = JSON.parse(ecolodgeData);

        // Obtener imágenes del ecolodge
        this.reservaService.getImagenesEcolodge(this.ecolodge.id).subscribe(
          (imagenes) => {
            this.imagenes = imagenes;
          },
          (error) => {
            this.toastr.error('Error al cargar las imágenes');
          }
        );
      }
    });
  }

  calcularPrecio() {
    if (this.fechaInicio && this.fechaFin) {
      const startDate = new Date(this.fechaInicio);
      const endDate = new Date(this.fechaFin);
      const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays <= 0) {
        this.toastr.error('La fecha de fin debe ser después de la fecha de inicio.');
        this.precioTotal = 0;
        return;
      }

      this.precioTotal = diffDays * this.ecolodge.precio; 
    }
  }

  reservar() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.toastr.error('Selecciona una fecha de inicio y fin');
      return;
    }

    if (!this.currentUser || !this.currentUser.sub) {
      this.toastr.error('Error: Usuario no autenticado.');
      return;
    }

    const reservaData = {
      ecolodge_id: this.ecolodge.id,
      viajero_id: Number(this.currentUser.sub),  
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      precio_total: this.precioTotal
    };

    console.log('Enviando reserva:', reservaData); // Debug en consola

    this.reservaService.verificarDisponibilidad(reservaData).subscribe(
      response => {
        console.log('Respuesta de disponibilidad:', response); // Imprimir la respuesta completa
        if (response.success) {
          // Crear la reserva si está disponible
          this.reservaService.crearReserva(reservaData).subscribe(
            () => {
              this.toastr.success('Reserva realizada con éxito');
              this.router.navigate(['/']);
            }
          );
        } else {
          this.toastr.error(response.error);
        }
      },
      error => {
        this.toastr.error('Error al verificar la disponibilidad');
      }
    );
  }
}

