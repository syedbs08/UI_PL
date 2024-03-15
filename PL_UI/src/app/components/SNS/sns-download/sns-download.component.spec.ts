import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnsDownloadComponent } from './sns-download.component';

describe('SnsDownloadComponent', () => {
  let component: SnsDownloadComponent;
  let fixture: ComponentFixture<SnsDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnsDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
