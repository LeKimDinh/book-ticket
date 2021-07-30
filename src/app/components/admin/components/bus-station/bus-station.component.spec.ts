import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusStationComponent } from './bus-station.component';

describe('BusStationComponent', () => {
  let component: BusStationComponent;
  let fixture: ComponentFixture<BusStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusStationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
