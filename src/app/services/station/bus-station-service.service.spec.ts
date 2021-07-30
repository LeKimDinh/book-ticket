import { TestBed } from '@angular/core/testing';

import { BusStationServiceService } from './bus-station-service.service';

describe('BusStationServiceService', () => {
  let service: BusStationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusStationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
