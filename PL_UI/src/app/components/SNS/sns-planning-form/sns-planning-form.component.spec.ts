import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnsPlanningFormComponent } from './sns-planning-form.component';

describe('SnsPlanningFormComponent', () => {
  let component: SnsPlanningFormComponent;
  let fixture: ComponentFixture<SnsPlanningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnsPlanningFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnsPlanningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
