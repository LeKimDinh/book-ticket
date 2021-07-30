import { TestBed } from '@angular/core/testing';

import { SeatServiceService } from './seat-service.service';

describe('SeatServiceService', () => {
  let service: SeatServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
