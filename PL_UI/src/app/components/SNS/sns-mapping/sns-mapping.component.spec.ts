import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnsMappingComponent } from './sns-mapping.component';

describe('DepartmentComponent', () => {
  let component: SnsMappingComponent;
  let fixture: ComponentFixture<SnsMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnsMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
