import { TestBed } from '@angular/core/testing';

import { DataserviceServiceService } from './dataservice-service.service';

describe('DataserviceServiceService', () => {
  let service: DataserviceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataserviceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
