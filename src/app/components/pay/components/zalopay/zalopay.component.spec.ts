import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZalopayComponent } from './zalopay.component';

describe('ZalopayComponent', () => {
  let component: ZalopayComponent;
  let fixture: ComponentFixture<ZalopayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZalopayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZalopayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
