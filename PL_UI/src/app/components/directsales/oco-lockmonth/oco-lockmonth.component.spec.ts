import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcoLockmonthComponent } from './oco-lockmonth.component';

describe('OcoLockmonthComponent', () => {
  let component: OcoLockmonthComponent;
  let fixture: ComponentFixture<OcoLockmonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcoLockmonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcoLockmonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
