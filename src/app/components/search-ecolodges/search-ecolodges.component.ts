import { Component, OnInit } from '@angular/core';
import { EcolodgeService } from '../../services/ecolodge.service';
import { Router } from '@angular/router';
import { Ecolodge } from '../../Model/ecolodge.model'; // Asegúrate de tener este archivo

import { ToastrService } from 'ngx-toastr';  // Importa el servicio de Toastr


@Component({
  selector: 'app-search-ecolodges',
  templateUrl: './search-ecolodges.component.html',
  styleUrls: ['./search-ecolodges.component.css']
})

  export class SearchEcolodgesComponent implements OnInit {
    ecolodges: Ecolodge[] = [];
    solarFilter: boolean = false;
    energiaFilter: boolean = false;
    roleFilter: string = '';  
  
    constructor(private ecolodgeService: EcolodgeService, private router: Router, private toastr: ToastrService) {}
  
    ngOnInit(): void {
      this.searchEcolodges();
    }
  
    searchEcolodges() {

      // Si el usuario es un "owner", no permitimos la búsqueda de ecolodges
    if (this.roleFilter === 'owner') {
      this.toastr.warning('Los propietarios no pueden buscar ecolodges.', 'Acceso denegado');
      return;  // Detiene la ejecución de la función
    }

      const solarValue = this.solarFilter ? 1 : 0;
      const energiaValue = this.energiaFilter ? 1 : 0;
  
      this.ecolodgeService.filterAll(solarValue, energiaValue, this.roleFilter).subscribe(
        (data: any) => {
          this.ecolodges = data;
        },
        (error) => {
          console.error('Error al buscar ecolodges', error);
          this.toastr.error('No tienes permisos para buscar los ecolodges', 'Error');
        }
      );
    }

// Método para redirigir a la página de reservas
alquilar(ecolodge: any) {
  this.router.navigate(['/reservas'], { queryParams: { ecolodge: JSON.stringify(ecolodge) } });
}
}
