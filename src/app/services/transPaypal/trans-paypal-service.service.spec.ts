import { TestBed } from '@angular/core/testing';

import { TransPaypalServiceService } from './trans-paypal-service.service';

describe('TransPaypalServiceService', () => {
  let service: TransPaypalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransPaypalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
