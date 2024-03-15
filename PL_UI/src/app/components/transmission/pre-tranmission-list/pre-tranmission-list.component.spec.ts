import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTranmissionListComponent } from './pre-tranmission-list.component';

describe('PreTranmissionListComponent', () => {
  let component: PreTranmissionListComponent;
  let fixture: ComponentFixture<PreTranmissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreTranmissionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreTranmissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
