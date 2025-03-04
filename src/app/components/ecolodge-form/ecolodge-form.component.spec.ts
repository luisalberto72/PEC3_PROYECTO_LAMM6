import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcolodgeFormComponent } from './ecolodge-form.component';

describe('EcolodgeFormComponent', () => {
  let component: EcolodgeFormComponent;
  let fixture: ComponentFixture<EcolodgeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcolodgeFormComponent]
    });
    fixture = TestBed.createComponent(EcolodgeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
