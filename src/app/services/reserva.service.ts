import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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
  
 getCurrentUser(): any {
  const token = localStorage.getItem('user');  // Obtiene el token del localStorage

  if (token) {
    try {
      // Decodificamos el token JWT
      const decodedToken: any = jwt_decode(token);

      // Asegurarse de que el token contiene el campo "sub" o cualquier otro identificador importante
      if (decodedToken && decodedToken.sub) {
        return decodedToken;  // Devuelve los datos del usuario (como el ID, correo, etc.)
      } else {
        console.error('Error: El token no contiene información válida');
        return null;
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;  // Si no se puede decodificar, devuelve null
    }
  }

  // Si no hay token en el localStorage, devuelve null
  return null;
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

  

  cancelarReserva(reservaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cancelar/${reservaId}`);
  }

   // Método para obtener una reserva por su ID
   obtenerReservaPorId(reservaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${reservaId}`);
  }

  obtenerReservasUsuario(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${userId}`).pipe(
      tap(reservas => console.log('Reservas obtenidas:', reservas))
    );
  }

  moverReservasFinalizadas(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mover-reservas`, {});
  }
  
  
}
