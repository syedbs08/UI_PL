import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedirectsaleuploadComponent } from './managedirectsaleupload.component';

describe('ManagedirectsaleuploadComponent', () => {
  let component: ManagedirectsaleuploadComponent;
  let fixture: ComponentFixture<ManagedirectsaleuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagedirectsaleuploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagedirectsaleuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
