import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataserviceService } from '../../dataservice-service.service';
import jwt_decode from 'jwt-decode';

interface PropertyDetails {
  title: string;
  price: number;
  address: string;
  description: string;
  status: string;
  type: string;
  rentalPeriod: string;
  city: string;
  email: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  houseImage1: string;
}

@Component({
  selector: 'app-property-detaile',
  templateUrl: './peroperty-detaile.component.html',
  styleUrls: ['./peroperty-detaile.component.css']
})
@Injectable()
export class PropertyDetaileComponent implements OnInit {
  Ptitle: string = '';
  Pprice: number = 0;
  Padresse: string = '';
  Pdescription: string = '';
  Pstatus: string = '';
  Ptype: string = '';
  Prentalperoid: string = '';
  Pcity: string = '';
  phonenum: string = '';

  Latitude: number = 5;
  Longitude: number = 5;
  image1: string = '';
  Toke: string | null = localStorage.getItem('user');
  token: any;
  Perporty: PropertyDetails | undefined;
  sharedVariable: number = 0;
  Message: string = '';
  Objesct: string = '';
  Email: string = '';
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    protected dataserv: DataserviceService,
    protected toastr: ToastrService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.GetPerporty();
  }

  GetPerporty(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.sharedVariable = Number(routeParams.get('Id'));
    this.dataserv.PerprotyDetails(this.sharedVariable).subscribe(
      (article) => {
        if (article && article.length > 0) {
          this.Perporty = article[0];
          this.populatePropertyDetails();
        } else {
          this.toastr.error('Property details not found');
        }
      },
      (error) => {
        this.toastr.error('Failed to load property details');
      }
    );
  }

  populatePropertyDetails(): void {
    if (this.Perporty) {
      this.Latitude = this.Perporty.latitude;
      this.Longitude = this.Perporty.longitude;
      this.image1 = this.Perporty.houseImage1;
      this.Email = this.Perporty.email;
      this.email = this.Perporty.email;
      this.Ptitle = this.Perporty.title;
      this.Pprice = this.Perporty.price;
      this.Padresse = this.Perporty.address;
      this.Pdescription = this.Perporty.description;
      this.Pstatus = this.Perporty.status;
      this.Ptype = this.Perporty.type;
      this.Prentalperoid = this.Perporty.rentalPeriod;
      this.Pcity = this.Perporty.city;
      this.phonenum = this.Perporty.phoneNumber;
    }
  }

  AddFavourite(): void {
    if (localStorage.getItem('user')) {
      this.token = jwt_decode(this.Toke as string);
      const user_id = this.token.user_id;
      const formdata = new FormData();
      formdata.append('Perporty_id', this.sharedVariable.toString());
      formdata.append('user_id', user_id.toString());

      this.dataserv.addToFavourites(formdata).subscribe(
        () => {
          this.toastr.info('Added to favorites');
        },
        () => {
          this.toastr.error('Failed to add to favorites');
        }
      );
    } else {
      this.toastr.info('You need to sign in first');
    }
  }

  SendMessage(): void {
    const formdata = new FormData();
    formdata.append('subject', this.Objesct);
    formdata.append('body', this.Message);
    formdata.append('recipient', this.Email);

    this.dataserv.EmailsSend(formdata).subscribe(
      () => {
        this.toastr.success('Message Sent Successfully');
        this.Objesct = '';
        this.Message = '';
        this.closeModal();
      },
      () => {
        this.toastr.error('Failed to send message');
      }
    );
  }

  closeModal(): void {
    const modal = document.getElementById('staticBackdrop');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  }
}
