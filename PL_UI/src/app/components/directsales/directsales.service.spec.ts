import { TestBed } from '@angular/core/testing';

import { DirectsalesService } from './directsales.service';

describe('DirectsalesService', () => {
  let service: DirectsalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectsalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
