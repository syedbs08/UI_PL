import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsidatesMasterComponent } from './psidates-master.component';

describe('PsidatesMasterComponent', () => {
  let component: PsidatesMasterComponent;
  let fixture: ComponentFixture<PsidatesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsidatesMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsidatesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
