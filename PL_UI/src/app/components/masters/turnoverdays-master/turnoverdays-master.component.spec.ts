import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverdaysMasterComponent } from './turnoverdays-master.component';

describe('TurnoverdaysMasterComponent', () => {
  let component: TurnoverdaysMasterComponent;
  let fixture: ComponentFixture<TurnoverdaysMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnoverdaysMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoverdaysMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
