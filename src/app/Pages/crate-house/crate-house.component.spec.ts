import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrateHouseComponent } from './crate-house.component';

describe('CrateHouseComponent', () => {
  let component: CrateHouseComponent;
  let fixture: ComponentFixture<CrateHouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrateHouseComponent]
    });
    fixture = TestBed.createComponent(CrateHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
