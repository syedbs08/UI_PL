import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnsPlanningComponent } from './sns-planning.component';

describe('SnsPlanningComponent', () => {
  let component: SnsPlanningComponent;
  let fixture: ComponentFixture<SnsPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnsPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnsPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
