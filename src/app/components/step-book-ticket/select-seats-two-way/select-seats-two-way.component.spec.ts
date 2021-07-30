import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSeatsTwoWayComponent } from './select-seats-two-way.component';

describe('SelectSeatsTwoWayComponent', () => {
  let component: SelectSeatsTwoWayComponent;
  let fixture: ComponentFixture<SelectSeatsTwoWayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSeatsTwoWayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSeatsTwoWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
