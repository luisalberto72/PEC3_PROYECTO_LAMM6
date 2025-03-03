import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentingListComponent } from './renting-list.component';

describe('RentingListComponent', () => {
  let component: RentingListComponent;
  let fixture: ComponentFixture<RentingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentingListComponent]
    });
    fixture = TestBed.createComponent(RentingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
