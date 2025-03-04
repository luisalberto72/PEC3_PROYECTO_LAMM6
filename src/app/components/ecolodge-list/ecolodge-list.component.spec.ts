import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcolodgeListComponent } from './ecolodge-list.component';

describe('EcolodgeListComponent', () => {
  let component: EcolodgeListComponent;
  let fixture: ComponentFixture<EcolodgeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcolodgeListComponent]
    });
    fixture = TestBed.createComponent(EcolodgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
