import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransmissionListComponent } from './transmission-list/transmission-list.component';
import { PreTranmissionListComponent } from './pre-tranmission-list/pre-tranmission-list.component';
import { TransmissionDataComponent } from './transmission-data/transmission-data.component';
import { DashUploadComponent } from './dash-upload/dash-upload.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'transmission-list',
        component:TransmissionListComponent
      },
      {
        path: 'pre-transmission-list',
        component:PreTranmissionListComponent
      },
      {
        path: 'transmit-data',
        component:TransmissionDataComponent
      },
      {
        path: 'dash-upload',
        component:DashUploadComponent
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransmissionRoutingModule { }
