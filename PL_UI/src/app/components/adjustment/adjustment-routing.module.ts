import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjusmentUploadComponent } from './adjusment-upload/adjusment-upload.component';
import { UserblockresolverService } from 'src/app/shared/services/userblockresolver.service';
import { LockPsiConstants} from 'src/app/shared/helpers/constants';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'fileupload',
        component: AdjusmentUploadComponent,
        // resolve:{         
        //   userBlock:UserblockresolverService  
        // }  ,
        // data: { pageBlock: LockPsiConstants.ADJ_Upload } 
      },
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentRoutingModule { }
