import { TestBed } from '@angular/core/testing';

import { EcolodgeService } from './ecolodge.service';

describe('EcolodgeService', () => {
  let service: EcolodgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcolodgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
