import { Component } from '@angular/core';
import { DataserviceService } from '../../dataservice-service.service';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-house',
  templateUrl: './crate-house.component.html',
  styleUrls: ['./crate-house.component.css']
})
export class CreateHouseComponent {
  constructor(protected dataserv: DataserviceService, protected router: Router, private route: ActivatedRoute, private toastr: ToastrService) { }

  Perportytoupdate: any;
  Property: any;
  Ptitle: any = '';
  Pprice: any = '';
  Padresse: any = '';
  Pdescription: any = '';
  Pstatus: any = '';
  Ptype: any = '';
  Prentalperoid: any = '';
  Pcity: any = '';
  email: any = '';
  phonenum: any = '';
  Latitude: any = 0;
  Longitude: any = 0;
  file: any;
  Property_id: any;
  addbtn: any;
  updatebtn: any;
  
  Toke: any = localStorage.getItem('user');
  token: any;

  ngOnInit() {
    this.testtherequist();
  }

  testtherequist() {
    const routeParams = this.route.snapshot.paramMap;
    this.Property_id = Number(routeParams.get('Id'));
    if (this.Property_id == 0) {
      this.addbtn = true;
      this.updatebtn = false;
    } else {
      this.addbtn = false;
      this.updatebtn = true;
      this.dataserv.PerprotyDetails(this.Property_id).subscribe(article => {
        this.Perportytoupdate = article;
        this.Ptitle = this.Perportytoupdate[0].Titile;
        this.Pprice = this.Perportytoupdate[0].Price;
        this.Padresse = this.Perportytoupdate[0].Adresse;
        this.Pdescription = this.Perportytoupdate[0].Description;
        this.Pstatus = this.Perportytoupdate[0].Status;
        this.Ptype = this.Perportytoupdate[0].Type;
        this.Prentalperoid = this.Perportytoupdate[0].ResntalPeriod;
        this.Pcity = this.Perportytoupdate[0].City;
        this.email = this.Perportytoupdate[0].Emaile;
        this.phonenum = this.Perportytoupdate[0].Phone_number;
      })
    }
  }

  UpdatePerporty() {
    this.token = jwt_decode(this.Toke);
    var $id = this.token.user_id;
    const formdata = new FormData();

    formdata.append("Titile", this.Ptitle);
    formdata.append("Price", this.Pprice);
    formdata.append("City", this.Pcity);
    formdata.append("Adresse", this.Padresse);
    formdata.append("Emaile", this.email);
    formdata.append("Phone_number", this.phonenum);
    formdata.append("Description", this.Pdescription);
    formdata.append("Status", this.Pstatus);
    formdata.append("Type", this.Ptype);
    formdata.append("ResntalPeriod", this.Prentalperoid);
    formdata.append("latitude", this.Latitude);
    formdata.append("longitude", this.Longitude);
    formdata.append("user_id", this.token.user_id);
    formdata.append("id", this.Property_id);

    this.dataserv.updateProperty(formdata, this.Property_id).subscribe(res => {
      this.Property = res;
      this.toastr.success('Property Updated successfully');
    })
  }

  uploadimg(event: any) {
    this.file = event.target.files[0];
  }

  AddProperty() {
    if (this.Ptitle == '' || this.Pprice == '' || this.Pcity == '' || this.Padresse == '' || this.email == '' || this.phonenum == '' ||
      this.Pdescription == '' || this.Pstatus == '' || this.Ptype == '' || this.file == null) {
      this.toastr.info('Please enter all information');
    } else {
      this.token = jwt_decode(this.Toke);

      const formdata = new FormData();

      formdata.append("HouseImage1", this.file, this.file.name);
      formdata.append("Titile", this.Ptitle);
      formdata.append("Price", this.Pprice);
      formdata.append("City", this.Pcity);
      formdata.append("Adresse", this.Padresse);
      formdata.append("Emaile", this.email);
      formdata.append("Phone_number", this.phonenum);
      formdata.append("Description", this.Pdescription);
      formdata.append("Status", this.Pstatus);
      formdata.append("Type", this.Ptype);
      formdata.append("ResntalPeriod", this.Prentalperoid);
    
      formdata.append("user_id", this.token.user_id);

      this.dataserv.createProperty(formdata).subscribe(res => {
        this.Property = res;
        this.toastr.success('Property added successfully');
        this.router.navigate(['/profile']);
      })
    }
  }
}
