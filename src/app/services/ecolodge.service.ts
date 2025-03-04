import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';  // Importamos la librería para decodificar el JWT

@Injectable({
  providedIn: 'root'
})
export class EcolodgeService {
  private apiUrl = 'http://127.0.0.1:8000/api/ecolodges';

  constructor(private http: HttpClient) {}




// Método para verificar si el token ha expirado
isTokenExpired(token: string): boolean {
  try {
    const decodedToken: any = jwt_decode(token);
    const currentTime = Date.now() / 1000; // Hora actual en segundos
    return decodedToken.exp < currentTime; // Compara la fecha de expiración con la hora actual
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return true; // Si no puede decodificar el token, asumimos que ha expirado
  }
}


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    if (!token) {
      throw new Error('Token is missing');  // Puedes lanzar un error o manejar la falta del token
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Añadir el token al encabezado de autorización
    });
  }
  // Método para obtener el ID del usuario desde el token JWT

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {}, { headers: this.getAuthHeaders() })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.access_token);
        }),
        catchError((error) => {
          console.error("Error al refrescar el token:", error);
          return throwError(() => new Error(error));
        })
      );
  }
  
  getUserId(): number | null {
  const token = localStorage.getItem('token');
  console.log("luisssss:", token);
  if (token) {
    try {
      const decodedToken: any = jwt_decode(token);
      console.log("Token decodificado:", decodedToken); // Para depurar
      return decodedToken.id || decodedToken.sub || null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }
  return null;
}

  
  // Método para obtener los ecolodges
  getEcolodges(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Método para guardar un ecolodge
  saveEcolodge(data: any): Observable<any> {
    console.log("Token almacenado:", localStorage.getItem('token'));
    console.log("Usuario ID obtenido:", this.getUserId());

    
    const propietarioId = this.getUserId();
    console.log("Propietario ID:", propietarioId);
    if (!propietarioId) {
      console.error('Usuario no autenticado, no se puede guardar el ecolodge.');
      return throwError(() => new Error('Usuario no autenticado'));
    }
  
   
  // Convertimos los valores booleanos a tinyint (0 o 1)
  data.paneles_solares = data.paneles_solares ? 1 : 0; // Si es true, guardamos 1, si es false, guardamos 0
  data.disponible = data.disponible ? 1 : 0; // Lo mismo para el campo 'disponible'

  // Aseguramos que propietario_id sea un número (bigint)
  data.propietario_id = propietarioId; 
  console.log("Datos que se envían:", data);
  
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error("Error al guardar el ecolodge:", error);
          return throwError(() => new Error(error)); // Use throwError with new signature
        })
      );
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token
    window.location.href = '/login'; // Redirige al login
  }
  
  
}


