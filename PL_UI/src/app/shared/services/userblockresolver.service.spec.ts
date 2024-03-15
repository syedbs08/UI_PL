import { TestBed } from '@angular/core/testing';

import { UserblockresolverService } from './userblockresolver.service';

describe('UserblockresolverService', () => {
  let service: UserblockresolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserblockresolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
