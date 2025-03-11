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
saveEcolodge(data: FormData): Observable<any> {
  // Obtener el token almacenado en localStorage
  const token = localStorage.getItem('user');
  console.log("Token almacenado:", token);

  // Obtener el ID del usuario (suponiendo que tienes un método para obtenerlo)
  const propietarioId = this.getUserId();
  console.log("Propietario ID:", propietarioId);

  // Obtener el rol del usuario almacenado en localStorage
  const userRole = localStorage.getItem('role');
  console.log("Rol de usuario:", userRole);

  // Verificar si el usuario tiene el rol adecuado (solo 'owner' o 'both' pueden agregar un ecolodge)
  if (userRole !== 'owner' && userRole !== 'both') {
    console.error('Solo los propietarios pueden guardar un ecolodge.');
    return throwError(() => new Error('Acción no permitida: solo los propietarios pueden agregar un ecolodge.'));
  }

  // Verificar si el propietario ID está disponible (asegúrate de que este método esté retornando el valor correcto)
  if (!propietarioId) {
    console.error('Usuario no autenticado, no se puede guardar el ecolodge.');
    return throwError(() => new Error('Usuario no autenticado'));
  }

  // Verificar si el token está presente (también puedes realizar una validación en el servidor, si es necesario)
  if (!token) {
    console.error('Token no encontrado en localStorage');
    return throwError(() => new Error('Usuario no autenticado'));
  }

  // Si todo está correcto, mostramos los datos que se enviarán al servidor
  console.log("Datos que se envían:", data);

  // Crear los encabezados de la solicitud con el token de autorización
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    // No es necesario especificar 'Content-Type' para FormData, Angular lo maneja automáticamente
  });

  // Realizar la solicitud POST al servidor y devolver el observable para manejar la respuesta
  return this.http.post('http://127.0.0.1:8000/api/ecolodges', data, {
    headers: headers,
    withCredentials: true, // Asegúrate de incluir esta opción si usas cookies
  }).pipe(
    tap(response => {
      // Aquí puedes hacer algo con la respuesta, como mostrar un mensaje
      console.log('Ecolodge guardado con éxito:', response);
    }),
    catchError(error => {
      // Maneja el error de forma adecuada
      console.error('Error al guardar el ecolodge:', error);
      return throwError(() => new Error('Error al guardar el ecolodge.'));
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
  
  
}


