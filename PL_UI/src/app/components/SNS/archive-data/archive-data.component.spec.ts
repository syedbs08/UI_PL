import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDataComponent } from './archive-data.component';

describe('ArchiveDataComponent', () => {
  let component: ArchiveDataComponent;
  let fixture: ComponentFixture<ArchiveDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
