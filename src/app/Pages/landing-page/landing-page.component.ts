import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../dataservice.service';

import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  constructor(protected functionhome:AppComponent,protected dataserv:DataService,private toastr: ToastrService,protected router:Router) {
  }

  ngOnInit() {
    console.log('user initialized')
    this.functionhome.ngOnInit()
    //this.functionhome.ngOnInit()
    //console.log(this.test())
  }
  
  
}
