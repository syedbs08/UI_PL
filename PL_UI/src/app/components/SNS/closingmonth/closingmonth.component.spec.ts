import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingmonthComponent } from './closingmonth.component';

describe('ClosingmonthComponent', () => {
  let component: ClosingmonthComponent;
  let fixture: ComponentFixture<ClosingmonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosingmonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosingmonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
