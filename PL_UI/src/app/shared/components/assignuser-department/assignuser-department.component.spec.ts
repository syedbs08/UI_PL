import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignuserDepartmentComponent } from './assignuser-department.component';

describe('AssignuserDepartmentComponent', () => {
  let component: AssignuserDepartmentComponent;
  let fixture: ComponentFixture<AssignuserDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignuserDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignuserDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
