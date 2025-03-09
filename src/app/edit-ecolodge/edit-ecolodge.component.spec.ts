import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEcolodgeComponent } from './edit-ecolodge.component';

describe('EditEcolodgeComponent', () => {
  let component: EditEcolodgeComponent;
  let fixture: ComponentFixture<EditEcolodgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEcolodgeComponent]
    });
    fixture = TestBed.createComponent(EditEcolodgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
