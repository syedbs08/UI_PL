import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSalesUploadComponent } from './direct-sales-upload.component';

describe('DirectSalesUploadComponent', () => {
  let component: DirectSalesUploadComponent;
  let fixture: ComponentFixture<DirectSalesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectSalesUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSalesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
