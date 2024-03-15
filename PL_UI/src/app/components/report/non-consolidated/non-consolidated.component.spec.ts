import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConsolidatedComponent } from './non-consolidated.component';

describe('NonConsolidatedComponent', () => {
  let component: NonConsolidatedComponent;
  let fixture: ComponentFixture<NonConsolidatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConsolidatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonConsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
