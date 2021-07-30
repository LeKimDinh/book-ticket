import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforIndividualComponent } from './infor-individual.component';

describe('InforIndividualComponent', () => {
  let component: InforIndividualComponent;
  let fixture: ComponentFixture<InforIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforIndividualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
