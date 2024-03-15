import { TestBed } from '@angular/core/testing';

import { COGService } from './cog.service';

describe('COGService', () => {
  let service: COGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(COGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
