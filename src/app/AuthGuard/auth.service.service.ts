import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }
  IslogedIn() {
    //var token=localStorage.getItem('user');
    if(localStorage.getItem('user')){
      
      return true;
    }else{
      return false;
    }
  }
}
