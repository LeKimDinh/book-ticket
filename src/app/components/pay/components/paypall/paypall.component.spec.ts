import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypallComponent } from './paypall.component';

describe('PaypallComponent', () => {
  let component: PaypallComponent;
  let fixture: ComponentFixture<PaypallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaypallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
