import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private url: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Registro y autenticación
  public registerUser(data: any) {
    return this.http.post(`${this.url}/Register`, data);
  }

  public loginUser(data: any) {
    return this.http.post(`${this.url}/Login`, data);
  }

  // Información del usuario
  public getUserInfo(userId: any) {
    return this.http.get<any>(`${this.url}/userinfo/${userId}`);
  }

  public updateUserProfile(data: any, id: any) {
    return this.http.post(`${this.url}/UserUpdate/${id}`, data);
  }

  // Token
  public validateToken(data: any) {
    return this.http.post(`${this.url}/TokenTest`, data);
  }

  // Variable compartida
  private sharedVariable: any;

  public updateSharedVariable(newValue: any) {
    this.sharedVariable = newValue;
  }

  public getSharedVariable() {
    return this.sharedVariable;
  }
}
