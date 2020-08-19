import { TestBed } from '@angular/core/testing';

import { SocketDataService } from './socket-data.service';

describe('SocketDataService', () => {
  let service: SocketDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
