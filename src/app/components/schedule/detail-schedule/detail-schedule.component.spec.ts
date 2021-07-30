import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailScheduleComponent } from './detail-schedule.component';

describe('DetailScheduleComponent', () => {
  let component: DetailScheduleComponent;
  let fixture: ComponentFixture<DetailScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
