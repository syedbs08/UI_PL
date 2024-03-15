import { TestBed } from '@angular/core/testing';

import { UserADService } from './user-ad.service';

describe('UserADService', () => {
  let service: UserADService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserADService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
