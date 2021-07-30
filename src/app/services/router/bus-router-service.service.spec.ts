import { TestBed } from '@angular/core/testing';

import { BusRouterServiceService } from './bus-router-service.service';

describe('BusRouterServiceService', () => {
  let service: BusRouterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusRouterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
