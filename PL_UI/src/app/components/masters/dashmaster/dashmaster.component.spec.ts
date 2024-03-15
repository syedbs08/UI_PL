import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashmasterComponent } from './dashmaster.component';

describe('DashmasterComponent', () => {
  let component: DashmasterComponent;
  let fixture: ComponentFixture<DashmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
