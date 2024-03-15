import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnsUploadComponent } from './sns-upload.component';

describe('SnsUploadComponent', () => {
  let component: SnsUploadComponent;
  let fixture: ComponentFixture<SnsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
