// frontend/src/app/services/house.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  private apiUrl = 'http://localhost/api/createRent';  // Cambia la URL según tu configuración

  constructor(private http: HttpClient) { }

  addHouse(houseData: any): Observable<any> {
    const formData = new FormData();
    formData.append('Title', houseData.title);
    formData.append('Price', houseData.price);
    formData.append('City', houseData.city);
    formData.append('Address', houseData.address);
    formData.append('Email', houseData.email);
    formData.append('Phone_number', houseData.phone);
    formData.append('Description', houseData.description);
    formData.append('Status', houseData.status);
    formData.append('Type', houseData.type);
    formData.append('HouseImage1', houseData.image);  // Aquí la imagen
    formData.append('user_id', houseData.user_id);

    return this.http.post(this.apiUrl, formData);
  }
}
