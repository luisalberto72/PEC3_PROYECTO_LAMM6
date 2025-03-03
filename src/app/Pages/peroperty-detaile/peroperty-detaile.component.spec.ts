import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeropertyDetaileComponent } from './peroperty-detaile.component';

describe('PeropertyDetaileComponent', () => {
  let component: PeropertyDetaileComponent;
  let fixture: ComponentFixture<PeropertyDetaileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeropertyDetaileComponent]
    });
    fixture = TestBed.createComponent(PeropertyDetaileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
