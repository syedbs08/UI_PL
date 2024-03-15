import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPricingComponent } from './stock-pricing/stock-pricing.component';
import { ArchiveDataComponent } from './archive-data/archive-data.component';
import{ SnsUploadComponent} from './sns-upload/sns-upload.component';
import { SnsDownloadComponent } from './sns-download/sns-download.component';
import { SnsPlanningComponent } from './sns-planning/sns-planning.component';
import { SnsMappingComponent } from './sns-mapping/sns-mapping.component';
import { UserblockresolverService } from 'src/app/shared/services/userblockresolver.service';
import { LockPsiConstants} from 'src/app/shared/helpers/constants';
import { ClosingmonthComponent } from './closingmonth/closingmonth.component';
import { unSaveChangeGuard } from 'src/app/shared/services/un-save-change.guard';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'stockpricing',
        component: StockPricingComponent
      },
      {
        path: 'archivedata',
        component: ArchiveDataComponent
      },
      {
        path: 'fileupload',
        component: SnsUploadComponent,
      },
      {
        path: 'sns-planning',
        component: SnsPlanningComponent,
      },
      {
        path: 'sns-mapping',
        component: SnsMappingComponent,
      }
      ,
      {
        path: 'snsdownload',
        component: SnsDownloadComponent
      }
      ,
      {
        path: 'month-closing',
        component:ClosingmonthComponent
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SnsRoutingModule { }
