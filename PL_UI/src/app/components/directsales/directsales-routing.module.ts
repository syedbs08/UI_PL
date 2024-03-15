import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectSalesUploadComponent } from './direct-sales-upload/direct-sales-upload.component';
import { OcIndicationMonthComponent } from './oc-indication-month/oc-indication-month.component';
import { OcoLockmonthComponent } from './oco-lockmonth/oco-lockmonth.component';
import { AgentSummaryDownloadComponent } from './agent-summary-download/agent-summary-download.component';
import { ManagedirectsaleuploadComponent } from './managedirectsaleupload/managedirectsaleupload.component';
import { UserblockresolverService } from 'src/app/shared/services/userblockresolver.service';
import { LockPsiConstants} from 'src/app/shared/helpers/constants';
import { SsdForecastUploadComponent } from './ssd-forecast-upload/ssd-forecast-upload.component';

const routes: Routes  = [
  {
    path: '',
    children: [
      {
        path: 'upload-agent-direct-sale',
        component: DirectSalesUploadComponent,
        // resolve:{         
        //   userBlock:UserblockresolverService  
        // }  ,
        // data: { pageBlock: LockPsiConstants.OPSI_Upload } 
      },
      {
        path: 'download-agent-direct-sale-summary',
        component: AgentSummaryDownloadComponent
      },
      {
        path: 'ocindicationmonth',
        component: OcIndicationMonthComponent,
        // resolve:{         
        //   userBlock:UserblockresolverService  
        // }  ,
        // data: { pageBlock: LockPsiConstants.OC_IndicationMonth } 
      },
      {
        path: 'oclocmonths',
        component: OcoLockmonthComponent,
        // resolve:{         
        //   userBlock:UserblockresolverService  
        // }  ,
        // data: { pageBlock: LockPsiConstants.O_LockMonthConfirm } 
      },
      {
        path: 'manageagentuploads',
        component: ManagedirectsaleuploadComponent,
        // resolve:{         
        //   userBlock:UserblockresolverService  
        // }  ,
        // data: { pageBlock: [LockPsiConstants.OPSI_Upload,LockPsiConstants.BP_Upload_DirectSale] } 
      },
      {
        path: 'ssd-forecast-upload',
        component: SsdForecastUploadComponent,
        // resolve:{         
        //   userBlock:UserblockresolverService  
        // }  ,
        // data: { pageBlock: [LockPsiConstants.SSD_Upload] } 
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectsalesRoutingModule { }
