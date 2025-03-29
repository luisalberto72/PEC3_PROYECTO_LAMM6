import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOpinionesComponent } from './ver-opiniones.component';

describe('VerOpinionesComponent', () => {
  let component: VerOpinionesComponent;
  let fixture: ComponentFixture<VerOpinionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerOpinionesComponent]
    });
    fixture = TestBed.createComponent(VerOpinionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
