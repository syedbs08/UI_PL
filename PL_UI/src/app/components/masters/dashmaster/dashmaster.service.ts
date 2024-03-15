import { Injectable } from '@angular/core';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
@Injectable({
  providedIn: 'root'
})
export class DashmasterService {


  constructor(private httpHelper: HttpModuleService,
    private apiUrl: ApiconstantService) { }

  getDashHeader() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}dash-master`,
      onBeforeSend(method, ajaxOptions) {
       
      },
    })
  }
  getDashMonthly() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}dash-monthly`,
      onBeforeSend(method, ajaxOptions) {
       
      },
    })
  }
  getDashMasterBp() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}dash-master-bp`,
      onBeforeSend(method, ajaxOptions) {
       
      },
    })
  }


}
