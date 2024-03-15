import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashmasterbpComponent } from './dashmasterbp.component';

describe('DashmasterbpComponent', () => {
  let component: DashmasterbpComponent;
  let fixture: ComponentFixture<DashmasterbpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashmasterbpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashmasterbpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
