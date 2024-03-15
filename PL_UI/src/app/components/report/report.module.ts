import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConsolidatedComponent } from './consolidated/consolidated.component';
import { ReportRoutingModule } from './report-routing.module';
import { DxPivotGridModule } from 'devextreme-angular';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NonConsolidatedComponent } from './non-consolidated/non-consolidated.component';
import { AccuracyComponent } from './accuracy/accuracy.component';
@NgModule({
  declarations: [
    ConsolidatedComponent,
    NonConsolidatedComponent,
    AccuracyComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    ReportRoutingModule,
    DxPivotGridModule,
    NgxDaterangepickerMd.forRoot(),
  ]
})
export class ReportModule { }
