import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUploadComponent } from './dash-upload.component';

describe('DashUploadComponent', () => {
  let component: DashUploadComponent;
  let fixture: ComponentFixture<DashUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
