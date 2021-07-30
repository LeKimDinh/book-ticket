import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforCustomerComponent } from './infor-customer.component';

describe('InforCustomerComponent', () => {
  let component: InforCustomerComponent;
  let fixture: ComponentFixture<InforCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
