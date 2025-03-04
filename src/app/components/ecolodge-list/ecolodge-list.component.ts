import { Component, OnInit } from '@angular/core';
import { EcolodgeService } from '../../services/ecolodge.service';

@Component({
  selector: 'app-ecolodge-list',
  templateUrl: './ecolodge-list.component.html'
})
export class EcolodgeListComponent implements OnInit {
  ecolodges: any[] = [];

  constructor(private ecolodgeService: EcolodgeService) {}

  ngOnInit() {
    this.ecolodgeService.getEcolodges().subscribe(data => {
      this.ecolodges = data;
    });
  }
}
