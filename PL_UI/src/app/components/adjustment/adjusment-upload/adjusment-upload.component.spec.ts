import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjusmentUploadComponent } from './adjusment-upload.component';

describe('AdjusmentUploadComponent', () => {
  let component: AdjusmentUploadComponent;
  let fixture: ComponentFixture<AdjusmentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjusmentUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjusmentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
