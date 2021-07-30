import { TestBed } from '@angular/core/testing';

import { ImageDriveService } from './image-drive.service';

describe('ImageDriveService', () => {
  let service: ImageDriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageDriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
