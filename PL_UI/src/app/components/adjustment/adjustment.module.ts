import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdjustmentRoutingModule } from './adjustment-routing.module';
import { AdjusmentUploadComponent } from './adjusment-upload/adjusment-upload.component';


@NgModule({
  declarations: [
    AdjusmentUploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdjustmentRoutingModule
  ]
})
export class AdjustmentModule { }
