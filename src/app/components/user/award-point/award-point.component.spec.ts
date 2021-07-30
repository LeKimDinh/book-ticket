import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardPointComponent } from './award-point.component';

describe('AwardPointComponent', () => {
  let component: AwardPointComponent;
  let fixture: ComponentFixture<AwardPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwardPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
