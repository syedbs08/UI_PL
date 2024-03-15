import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { CountryMasterComponent } from './country-master/country-master.component';
import { DepartmentComponent } from './department/department.component';
import { RegionMasterComponent } from './region-master/region-master.component';
import { ManageMenuComponent } from './settings/manage-menu/manage-menu.component';
import { UsermanagementComponent } from './settings/usermanagement/usermanagement.component';
import { CurrencyMasterComponent } from './currency-master/currency-master.component';
import { ProductcategoryMasterComponent } from './productcategory-master/productcategory-master.component';
import { UserprofileComponent } from '../../shared/components/userprofile/userprofile.component';
import { UserprofiledetailsComponent } from './settings/userprofiledetails/userprofiledetails.component';
import { PsidatesMasterComponent } from './psidates-master/psidates-master.component';
import { TurnoverdaysMasterComponent } from './turnoverdays-master/turnoverdays-master.component';
import { MaterialMasterComponent } from './material-master/material-master.component';
import { DevextreamtableComponent } from './devextreamtable/devextreamtable.component';
import { DashmasterComponent } from './dashmaster/dashmaster.component';
import { CustomerMasterComponent } from './customer-master/customer-master.component';
import { DashmasterbpComponent } from './dashmaster/dashmasterbp/dashmasterbp.component';
import { LockPsiMasterComponent } from './lock-psi-master/lock-psi-master.component';

import { UserdocumentComponent } from './settings/useractivities/userdocument/userdocument.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'country',
        component: CountryMasterComponent
      },
      {
        path: 'department',
        component: DepartmentComponent
      },
      {
        path: 'company',
        component: CompanyComponent
      },
      {
        path: 'managemenu',
        component: ManageMenuComponent
      },
      {
        path: 'manageuser',
        component: UsermanagementComponent
      },
      {
        path: 'region',
        component: RegionMasterComponent
      },
      {
        path: 'currency',
        component: CurrencyMasterComponent
      },
      {
        path: 'productcategory',
        component: ProductcategoryMasterComponent
      }
      ,
      {
        path: 'userprofile',
        component: UserprofiledetailsComponent
      }
      ,
      {
        path: 'psiDates',
        component: PsidatesMasterComponent
      }

      ,
      {
        path: 'turnoverdays',
        component: TurnoverdaysMasterComponent
      }
      ,
      {
        path: 'material',
        component: MaterialMasterComponent
      }
      ,
      {
        path: 'devgrid',
        component: DevextreamtableComponent
      }
      ,
      {
        path: 'dash',
        component: DashmasterComponent
      }
      ,
      {
        path: 'dash-bp',
        component: DashmasterbpComponent
      }
      ,
      {
        path: 'customer',
        component: CustomerMasterComponent
      }
      ,
      {
        path: 'filedirectory',
        component: UserdocumentComponent
      }
      ,
        {
        path: 'psi-lock',
        component: LockPsiMasterComponent
      }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
