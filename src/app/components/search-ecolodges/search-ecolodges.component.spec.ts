import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEcolodgesComponent } from './search-ecolodges.component';

describe('SearchEcolodgesComponent', () => {
  let component: SearchEcolodgesComponent;
  let fixture: ComponentFixture<SearchEcolodgesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchEcolodgesComponent]
    });
    fixture = TestBed.createComponent(SearchEcolodgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
