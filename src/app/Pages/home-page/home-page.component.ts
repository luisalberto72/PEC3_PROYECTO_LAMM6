import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../dataservice.service';

import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  constructor(protected functionhome:AppComponent,protected dataserv:DataService,private toastr: ToastrService,protected router:Router) {
  }

  ngOnInit() {
    console.log('user initialized')
    this.functionhome.ngOnInit()
  
  }
  
  
}
