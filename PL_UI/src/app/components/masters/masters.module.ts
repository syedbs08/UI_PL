import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { MastersRoutingModule } from './masters-routing';
import { CountryMasterComponent } from './country-master/country-master.component';
import {DepartmentComponent} from './department/department.component';
import { CompanyComponent } from './company/company.component';
import { RegionMasterComponent } from './region-master/region-master.component';
import { ManageMenuComponent } from './settings/manage-menu/manage-menu.component';
import { UsermanagementComponent } from './settings/usermanagement/usermanagement.component';
import { CurrencyMasterComponent } from './currency-master/currency-master.component';
import { ProductcategoryMasterComponent } from './productcategory-master/productcategory-master.component';
import { UserprofiledetailsComponent } from './settings/userprofiledetails/userprofiledetails.component';
import { AssignuserDepartmentComponent } from 'src/app/shared/components/assignuser-department/assignuser-department.component';
import { PsidatesMasterComponent } from './psidates-master/psidates-master.component';
import { TurnoverdaysMasterComponent } from './turnoverdays-master/turnoverdays-master.component';
import { MaterialMasterComponent } from './material-master/material-master.component';
import { DevextreamtableComponent } from './devextreamtable/devextreamtable.component';
import { AssignuserproductComponent } from 'src/app/shared/components/assignuserproduct/assignuserproduct.component';
import { DashmasterComponent } from './dashmaster/dashmaster.component';
import { CustomerMasterComponent } from './customer-master/customer-master.component';
import { DashmasterbpComponent } from './dashmaster/dashmasterbp/dashmasterbp.component';
import { HttpClientModule } from '@angular/common/http';
import { LockPsiMasterComponent } from './lock-psi-master/lock-psi-master.component';
import { UserdocumentComponent } from './settings/useractivities/userdocument/userdocument.component';
import { UserfilesComponent } from './settings/useractivities/userfiles/userfiles.component';

@NgModule({
  declarations: [
    CountryMasterComponent,
    CompanyComponent,
    DepartmentComponent,
    ManageMenuComponent,
    ManageMenuComponent,
    UsermanagementComponent,
    RegionMasterComponent,
    CurrencyMasterComponent,
    ProductcategoryMasterComponent,
    UserprofiledetailsComponent,
    AssignuserDepartmentComponent,
    AssignuserproductComponent,
    PsidatesMasterComponent,
    TurnoverdaysMasterComponent,
    MaterialMasterComponent,
    DevextreamtableComponent,
    DashmasterComponent,
    CustomerMasterComponent,
    DashmasterbpComponent,
    LockPsiMasterComponent,
    UserdocumentComponent,
    UserfilesComponent


  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MastersRoutingModule,
    NgbModule,  
    SharedModule,
 
  ],
  providers:[
  
  ]
})
export class MasterModule { }
