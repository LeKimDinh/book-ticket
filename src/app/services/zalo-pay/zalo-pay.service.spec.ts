import { TestBed } from '@angular/core/testing';

import { ZaloPayService } from './zalo-pay.service';

describe('ZaloPayService', () => {
  let service: ZaloPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZaloPayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
