import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketBookingHistoryComponent } from './ticket-booking-history.component';

describe('TicketBookingHistoryComponent', () => {
  let component: TicketBookingHistoryComponent;
  let fixture: ComponentFixture<TicketBookingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketBookingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketBookingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
