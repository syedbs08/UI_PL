import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfilesComponent } from './userfiles.component';

describe('UserfilesComponent', () => {
  let component: UserfilesComponent;
  let fixture: ComponentFixture<UserfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
