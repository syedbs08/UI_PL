import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COGUploadComponent } from './cog-upload.component';

describe('COGUploadComponent', () => {
  let component: COGUploadComponent;
  let fixture: ComponentFixture<COGUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ COGUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COGUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
