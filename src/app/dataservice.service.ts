import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var Email: any;

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

  // Propiedades
  public createProperty(data: any) {
    return this.http.post(`${this.url}/createRent`, data);
  }

  public updateProperty(data: any, id: any) {
    return this.http.post(`${this.url}/updateRent/${id}`, data);
  }

  public deleteProperty(id: any) {
    return this.http.delete(`${this.url}/Delete/${id}`);
  }

  public listProperties() {
    return this.http.get<any>(`${this.url}/GetAll`);
  }

  public getPropertyDetails(id: any) {
    return this.http.get<any>(`${this.url}/GetDetails/${id}`);
  }

  public getUserProperties(userId: any) {
    return this.http.get<any>(`${this.url}/MyCreated/${userId}`);
  }

  // Favoritos
  public addToFavourites(data: any) {
    return this.http.post(`${this.url}/Favourite`, data);
  }

  public getUserFavourites(userId: any) {
    return this.http.get<any>(`${this.url}/YourFavourite/${userId}`);
  }

  // Información del usuario
  public getUserInfo(userId: any) {
    return this.http.get<any>(`${this.url}/userinfo/${userId}`);
  }

  public updateUserProfile(data: any, id: any) {
    return this.http.post(`${this.url}/UserUpdate/${id}`, data);
  }

  public getUserStats(userId: any) {
    return this.http.get<any>(`${this.url}/usernumbers/${userId}`);
  }

  // Utilidades
  public sendEmail(data: any) {
    return this.http.post(`${this.url}/messages`, data);
  }

  public validateToken(data: any) {
    return this.http.post(`${this.url}/TokenTest`, data);
  }

  public searchProperties(data: any) {
    return this.http.post(`${this.url}/Search`, data);
  }

  // Variable compartida
  private sharedVariable: any;

  public updateSharedVariable(newValue: any) {
    this.sharedVariable = newValue;
  }

  public getSharedVariable() {
    return this.sharedVariable;
  }

  // Método para obtener detalles de la propiedad
  PerprotyDetails(Property_id: any): Observable<any> {
    const url = `${this.url}/propiedades/${Property_id}`;
    return this.http.get<any>(url);
  }

  // Método para obtener el perfil de usuario
  UserProfile(data: any, userId: number): Observable<any> {
    let headers = new HttpHeaders();

    // Si los datos son JSON, establecemos Content-Type
    if (!(data instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return this.http.patch(`${this.url}/usuarios/${userId}/perfil`, data, { headers });
  }
  

  // Método para obtener publicaciones y favoritos de un usuario
  GetUserPostsandfavourit(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/usernumbers/${userId}`);
  }

  // Obtener lista de propiedades favoritas del usuario
  UserFavouritList(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/user/${userId}/favourites`);
  }

  // Eliminar una propiedad por ID
  Delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/properties/${id}`);
  
}

Search(formData: FormData): Observable<any> {
  // Reemplaza 'tu_url_aqui' con la URL de tu API
  return this.http.post(`${this.url}`, formData);
}

 EmailsSend(formdata: any) {
    return new Observable((observer) => {
      Email.send({
        SecureToken: 'YOUR_SECURE_TOKEN',
        To: 'recipient@example.com',
        From: formdata.email,
        Subject: formdata.subject,
        Body: formdata.message,
      })
        .then((message: any) => {
          observer.next(message);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  getEcolodgeDetails(id: number): Observable<any> {
    return this.http.get(`${this.url}/ecolodges/${id}`);
  }

  createEcolodge(formData: FormData): Observable<any> {
    return this.http.post(this.url+'/ecolodges/', formData);
  }

  updateEcolodge(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.url}/ecolodges/${id}`, formData);
  }

}
