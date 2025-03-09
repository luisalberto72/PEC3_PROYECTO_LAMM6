import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { DataService } from './dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  firstName: string = '';
  lastName: string = '';
  profilePicture: string = '';
  user: any;
  token: any;

  constructor(
    protected dataserv: DataService,
    private toastr: ToastrService,
    protected router: Router
  ) {}

  title = 'Ecolodges';
  expression = false;
  login = false;
  signin = false;
  Toke: any;

  ngOnInit() {
    this.LogedIn();
  }

  LogedIn() {
    const storedUser = localStorage.getItem('user');
  
    if (storedUser) {
      this.login = false;
      this.signin = false;
      this.expression = true;
  
      this.Toke = storedUser;
      console.log('Token:', this.Toke);
  
      this.token = jwt_decode(this.Toke);
      console.log('Decoded Token:', this.token);
  
      const userId = this.token.sub;
      console.log('User ID:', userId);
  
      // Check if the token has expired
      if (this.token.exp * 1000 < Date.now()) {
        // Token has expired
        this.logout();
        this.toastr.error('Session expired. Please log in again.');
        return;
      }
  
      if (userId) {
        this.dataserv.getUserInfo(userId).subscribe(
          (userinfo) => {
            console.log('User Info:', userinfo);
            this.user = userinfo;
            this.firstName = this.user.first_name || '';
            this.lastName = this.user.last_name || '';
            this.profilePicture = this.user.profile_picture || '';
            localStorage.removeItem('role');
            localStorage.setItem('role', this.user.role);
          },
          (error) => {
            this.toastr.error('Error fetching user information.');
            console.error('API error:', error);
          }
        );
      } else {
        console.log('No user_id found in token');
      }
    } else {
      this.login = true;
      this.signin = true;
      this.expression = false;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}