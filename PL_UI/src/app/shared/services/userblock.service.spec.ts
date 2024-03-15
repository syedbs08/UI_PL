import { TestBed } from '@angular/core/testing';

import { UserblockService } from './userblock.service';

describe('UserblockService', () => {
  let service: UserblockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserblockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
