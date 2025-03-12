import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';  // Importamos la librería para decodificar el JWT


@Injectable({
  providedIn: 'root'
})
export class EcolodgeService {
  private apiUrl = 'http://127.0.0.1:8000/api/ecolodges';
  private api='http://127.0.0.1:8000/api';
 

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
    const token = localStorage.getItem('user');  // Obtener el token del localStorage
    if (!token) {
      throw new Error('Token is missing');  // Puedes lanzar un error o manejar la falta del token
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Añadir el token al encabezado de autorización
    });
  }
 

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
  const token = localStorage.getItem('user');

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

 // Método para obtener un ecolodge por su ID
 getEcolodgeById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}

  // Método para guardar un ecolodge
  saveEcolodge(data: any): Observable<any> {
    console.log("Token almacenado:", localStorage.getItem('token'));
    console.log("Usuario ID obtenido:", this.getUserId());

    
    const propietarioId = this.getUserId();
    console.log("Propietario ID:", propietarioId);

  const userRole = localStorage.getItem('role'); // Asumiendo que el rol está guardado en el localStorage
  console.log("userRole",userRole);
  // Verificamos que el usuario tenga el rol de propietario
  if (userRole !== 'owner' && userRole !== 'both' ) {
    console.error('Solo los propietarios pueden guardar un ecolodge.');
    return throwError(() => new Error('Acción no permitida: solo los propietarios pueden agregar un ecolodge.'));
  }

    if (!propietarioId) {
      console.error('Usuario no autenticado, no se puede guardar el ecolodge.');
      return throwError(() => new Error('Usuario no autenticado'));
    }
  
   
  // Convertimos los valores booleanos a tinyint (0 o 1)
  data.paneles_solares = data.paneles_solares ? 1 : 0; // Si es true, guardamos 1, si es false, guardamos 0
  data.energia_renovable = data.energia_renovable ? 1 : 0; // Lo mismo para el campo 'energia_renovable' 

  // Aseguramos que propietario_id sea un número (bigint)
  data.propietario_id = Number(propietarioId); 
  console.log("Datos que se envían:", data);
  
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error("Error al guardar el ecolodge:", error);
          return throwError(() => new Error(error)); // Use throwError with new signature
        })
      );
  }

  filtrarEcolodges(solar: boolean | null, energia: boolean | null, propietarioId: number | null): Observable<any[]> {
    let queryParams: string[] = [];
    if (solar !== null) {
      queryParams.push(`paneles_solares=${solar ? 1 : 0}`);
    }
    if (energia !== null) {
      queryParams.push(`energia_renovable=${energia ? 1 : 0}`);
    }
    if (propietarioId !== null) {
      queryParams.push(`propietario_id=${propietarioId}`);
    }
    const query = queryParams.length ? `?${queryParams.join('&')}` : '';

    const token = localStorage.getItem('user');  // O desde donde tengas el token JWT
 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.api}/ecolodges-filtrar${query}`, { headers });
}

updateEcolodge(id: number, data: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('user')}`,
    'Content-Type': 'application/json'
  });

  return this.http.put(`${this.api}/ecolodges/${id}`, data, { headers });
}

  deleteEcolodge(id: number): Observable<any> {
    return this.http.delete(`${this.api}/ecolodges/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token
    window.location.href = '/login'; // Redirige al login
  }
  

   // Este método debe devolver un Observable
   uploadImage(image: File, ecolodgeId: number): Observable<any> {
    const formData = new FormData();
    formData.append('image', image, image.name);

    return this.http.post(`http://localhost:8000/api/ecolodge/${ecolodgeId}/image`, formData);
  }
}
  
  



