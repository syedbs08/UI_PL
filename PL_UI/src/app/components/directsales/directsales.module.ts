import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.module';

import { DirectsalesRoutingModule } from './directsales-routing.module';
import { OcIndicationMonthComponent } from './oc-indication-month/oc-indication-month.component';
import { DirectSalesUploadComponent } from './direct-sales-upload/direct-sales-upload.component';
import { OcoLockmonthComponent } from './oco-lockmonth/oco-lockmonth.component';
import { AgentSummaryDownloadComponent } from './agent-summary-download/agent-summary-download.component';
import { ManagedirectsaleuploadComponent } from './managedirectsaleupload/managedirectsaleupload.component';
import { SsdForecastUploadComponent } from './ssd-forecast-upload/ssd-forecast-upload.component';
import { DxPivotGridModule } from 'devextreme-angular';
@NgModule({
  declarations: [
    OcIndicationMonthComponent,
    DirectSalesUploadComponent,
    OcoLockmonthComponent,
    AgentSummaryDownloadComponent,
    ManagedirectsaleuploadComponent,
    SsdForecastUploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DirectsalesRoutingModule,
    DxPivotGridModule
  ],
  providers: [

  ]
})
export class DirectsalesModule { }
