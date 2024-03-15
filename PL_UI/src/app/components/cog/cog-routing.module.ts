import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COGUploadComponent } from './cog-upload/cog-upload.component';
import { UserblockresolverService } from 'src/app/shared/services/userblockresolver.service';
import { LockPsiConstants} from 'src/app/shared/helpers/constants';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'fileupload',
        component: COGUploadComponent,
        // resolve:{         
        //   userBlock:UserblockresolverService  
        // }  ,
        // data: { pageBlock: LockPsiConstants.COG_Upload } 
      },
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class COGRoutingModule { }
