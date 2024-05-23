import { TestBed } from '@angular/core/testing';

import { SocketConnectionServiceService } from './socket-connection-service.service';

describe('SocketConnectionServiceService', () => {
  let service: SocketConnectionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketConnectionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
