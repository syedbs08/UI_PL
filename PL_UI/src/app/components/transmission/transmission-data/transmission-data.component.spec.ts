import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionDataComponent } from './transmission-data.component';

describe('TransmissionDataComponent', () => {
  let component: TransmissionDataComponent;
  let fixture: ComponentFixture<TransmissionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmissionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransmissionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
