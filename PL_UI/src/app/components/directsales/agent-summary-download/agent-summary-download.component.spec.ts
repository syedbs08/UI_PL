import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSummaryDownloadComponent } from './agent-summary-download.component';

describe('AgentSummaryDownloadComponent', () => {
  let component: AgentSummaryDownloadComponent;
  let fixture: ComponentFixture<AgentSummaryDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSummaryDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentSummaryDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
