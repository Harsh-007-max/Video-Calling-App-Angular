import { TestBed } from '@angular/core/testing';

import { FireAuthServiceService } from './fire-auth-service.service';

describe('FireAuthServiceService', () => {
  let service: FireAuthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireAuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
