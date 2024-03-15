import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcIndicationMonthComponent } from './oc-indication-month.component';

describe('OcIndicationMonthComponent', () => {
  let component: OcIndicationMonthComponent;
  let fixture: ComponentFixture<OcIndicationMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcIndicationMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcIndicationMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
