import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialReserva } from '../Model/historial-reserva.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialReservaService {
  private apiUrl = 'http://127.0.0.1:8000/api/historial-reservas';

  constructor(private http: HttpClient) {}

 // Método para obtener el historial de reservas
 obtenerHistorialReservas(): Observable<any[]> {
  const token = localStorage.getItem('user');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(this.apiUrl, { headers });
}

}
