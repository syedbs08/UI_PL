import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsdForecastUploadComponent } from './ssd-forecast-upload.component';

describe('SsdForecastUploadComponent', () => {
  let component: SsdForecastUploadComponent;
  let fixture: ComponentFixture<SsdForecastUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsdForecastUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsdForecastUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
