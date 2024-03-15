import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnsRoutingModule } from './sns-routing.module';
import { StockPricingComponent } from './stock-pricing/stock-pricing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArchiveDataComponent } from './archive-data/archive-data.component';
import { SnsUploadComponent } from './sns-upload/sns-upload.component';
import { SnsDownloadComponent } from './sns-download/sns-download.component';
import { SnsPlanningComponent } from './sns-planning/sns-planning.component';
import { SnsPlanningFormComponent } from './sns-planning-form/sns-planning-form.component';
import { ClosingmonthComponent } from './closingmonth/closingmonth.component';
import { SnsMappingComponent } from './sns-mapping/sns-mapping.component';

@NgModule({
  declarations: [
    StockPricingComponent,
    ArchiveDataComponent,
    SnsUploadComponent,
    SnsDownloadComponent,
    SnsPlanningComponent,
    SnsPlanningFormComponent,
    ClosingmonthComponent,
    SnsMappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SnsRoutingModule
  ]
})
export class SnsModule { }
