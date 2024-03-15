import { TestBed } from '@angular/core/testing';

import { SnsService } from './sns.service';

describe('SnsService', () => {
  let service: SnsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
