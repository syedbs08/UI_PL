import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignuserproductComponent } from './assignuserproduct.component';

describe('AssignuserproductComponent', () => {
  let component: AssignuserproductComponent;
  let fixture: ComponentFixture<AssignuserproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignuserproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignuserproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
