import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // REGISTRO Y AUTENTICACIÓN
  public registerUser(data: any): Observable<any> {
    return this.http.post(`${this.url}/register`, data);
  }

  public loginUser(data: any): Observable<any> {
    return this.http.post(`${this.url}/login`, data);
  }

  // OBTENER INFORMACIÓN DEL USUARIO
  public getUserInfo(userId: any): Observable<any> {
    return this.http.get<any>(`${this.url}/userinfo/${userId}`, { headers: this.getAuthHeaders() });
  }
  

  public updateUserProfile(data: any, id: any): Observable<any> {
    return this.http.post(`${this.url}/UserUpdate/${id}`, data, { headers: this.getAuthHeaders() });
  }

  // VALIDAR TOKEN
  public validateToken(data: any): Observable<any> {
    return this.http.post(`${this.url}/TokenTest`, data, { headers: this.getAuthHeaders() });
  }

  // REFRESCAR TOKEN
  public refreshToken(): Observable<any> {
    return this.http.post(`${this.url}/refresh`, {}, { headers: this.getAuthHeaders() });
  }

  //  MANEJO DEL TOKEN
  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }

  // OBTENER HEADERS CON TOKEN
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}

