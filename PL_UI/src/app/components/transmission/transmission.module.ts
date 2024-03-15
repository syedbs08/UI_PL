import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransmissionListComponent } from './transmission-list/transmission-list.component';
import { TransmissionRoutingModule } from './transmission-routing.module';
import { PreTranmissionListComponent } from './pre-tranmission-list/pre-tranmission-list.component';
import { TransmissionDataComponent } from './transmission-data/transmission-data.component';
import { DashUploadComponent } from './dash-upload/dash-upload.component';



@NgModule({
  declarations: [
    TransmissionListComponent,
    PreTranmissionListComponent,
    TransmissionDataComponent,
    DashUploadComponent
  ],
  imports: [

    CommonModule,
    NgbModule,
    SharedModule,
    TransmissionRoutingModule
  ]
})
export class TransmissionModule { }
