import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockPsiMasterComponent } from './lock-psi-master.component';

describe('LockPsiMasterComponent', () => {
  let component: LockPsiMasterComponent;
  let fixture: ComponentFixture<LockPsiMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockPsiMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockPsiMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
