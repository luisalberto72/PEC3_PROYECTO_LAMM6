import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';  // Importamos la librería para decodificar el JWT

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8000/api/reservas'; 
  private api = 'http://localhost:8000/api';  

  constructor(private http: HttpClient) {}

  verificarDisponibilidad(reservaData: any) {
    console.log('Enviando datos a verificar disponibilidad:', reservaData);
    return this.http.post<any>(`${this.apiUrl}/verificar-disponibilidad`, reservaData);
  }
  
  crearReserva(reservaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, reservaData);
  }

   // Método para obtener el token del usuario
   getToken(): string | null {
    return localStorage.getItem('user');
  }
  
  // Método para obtener el usuario actual decodificando el token
  getCurrentUser(): any {
    const token = localStorage.getItem('user');
    if (token) {
      try {
        // Decodificamos el token JWT
        const decodedToken: any = jwt_decode(token);
        return decodedToken; // Devuelve los datos del usuario (como el ID, correo, etc.)
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null; // Si no se puede decodificar, devuelve null
      }
    }
    return null; // Si no hay token, devuelve null
  }

  getRequestHeaders(): { Authorization: string } | {} {
    const token = this.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {}; // Si no hay token, devuelve un objeto vacío
  }
  
  getImagenesEcolodge(ecolodgeId: number): Observable<any> {
    return this.http.get(`${this.api}/ecolodge/${ecolodgeId}/imagenes`);
  }
}
