import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevextreamtableComponent } from './devextreamtable.component';

describe('DevextreamtableComponent', () => {
  let component: DevextreamtableComponent;
  let fixture: ComponentFixture<DevextreamtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevextreamtableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevextreamtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
