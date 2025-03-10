import { Component, OnInit } from '@angular/core';
import { EcolodgeService } from '../../services/ecolodge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecolodge-list',
  templateUrl: './ecolodge-list.component.html'
})
export class EcolodgeListComponent implements OnInit {
  ecolodges: any[] = [];  // Lista de ecolodges filtrados
  solarFilter: boolean | null = null;
  energiaFilter: boolean | null = null;
  propietarioId: number | null = null;  // Declaramos la propiedad propietarioId
  
  constructor(private ecolodgeService: EcolodgeService, private router: Router) {}

  ngOnInit() {
    this.filtrar();  // Llama a filtrar al cargar el componente
  }

  filtrar() {
    this.ecolodgeService.filtrarEcolodges(this.solarFilter, this.energiaFilter, this.propietarioId).subscribe(
      (data) => {
        this.ecolodges = data;  // Asigna los ecolodges filtrados a la propiedad 'ecolodges'
      },
      (error) => {
        console.error('Error al filtrar ecolodges', error);
      }
    );
  }
  
  editEcolodge(id: number) {
    this.router.navigate(['/editar-ecolodge', id]);
  }

  deleteEcolodge(id: number) {
    if (confirm('¿Deseas eliminar este Ecolodge?')) {
      this.ecolodgeService.deleteEcolodge(id).subscribe(
        () => {
          alert('Ecolodge eliminado');
          this.filtrar();  // Recargar la lista tras la eliminación
        },
        (error) => {
          console.error('Error al eliminar el ecolodge', error);
        }
      );
    }
  }
}
