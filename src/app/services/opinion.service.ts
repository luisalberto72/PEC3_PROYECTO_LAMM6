import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Opinion } from '../Model/opinion.model';

@Injectable({
  providedIn: 'root'
})
export class OpinionService {
  private apiUrl = 'http://localhost:8000/api/opiniones';
  private api = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Obtener opiniones con filtros (si se proporcionan)
  obtenerOpiniones(filtros: any = {}): Observable<Opinion[]> {
    let params = new HttpParams();

    // Agregar filtros como parámetros de consulta
    if (filtros.ecolodge_nombre) {
      params = params.set('ecolodge_nombre', filtros.ecolodge_nombre);
    }
    if (filtros.calificacion) {
      params = params.set('calificacion', filtros.calificacion);
    }
    if (filtros.orden) {
      params = params.set('orden', filtros.orden);
    }

    return this.http.get<Opinion[]>(`${this.apiUrl}/opiniones`, { params });
  }


  enviarOpinion(opinion: any): Observable<any> {
    return this.http.post(this.apiUrl, opinion);
  }
 // Función para obtener las opiniones filtradas
 filtrarOpiniones(filtros: any): Observable<any[]> {
  let params = new HttpParams();

  if (filtros.ecolodge_nombre) {
    params = params.set('ecolodge_nombre', filtros.ecolodge_nombre);
  }
  if (filtros.calificacion) {
    params = params.set('calificacion', filtros.calificacion);
  }
  if (filtros.orden) {
    params = params.set('orden', filtros.orden);
  }

  return this.http.get<any[]>(`${this.api}/opiniones/filtrar`, { params });
}

// Función para obtener los ecolodges
obtenerEcolodges(): Observable<any[]> {
  const token = localStorage.getItem('user'); // O sessionStorage.getItem('token');
  
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  return this.http.get<any[]>(`${this.apiUrl}/ecolodges`, { headers: headers });
}

}
