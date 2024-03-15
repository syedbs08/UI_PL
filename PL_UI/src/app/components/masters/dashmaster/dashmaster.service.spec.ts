import { TestBed } from '@angular/core/testing';

import { DashmasterService } from './dashmaster.service';

describe('DashmasterService', () => {
  let service: DashmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
