import { Injectable } from '@angular/core';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DirectsalesService {
  constructor(private httpHelper: HttpModuleService,
    private apiUrl: ApiconstantService
    ) { }

 

  getOCIndicationMonth(command) {

    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlDirectSale}get-ocIndication-month`,
      loadParams: command,
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.method = 'POST'
      }
    })
  }
  updateOCIndicationMonth(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlDirectSale + "update-ocIndication-month", command);
  }

  uploadAgentDirectSale(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlDirectSale + "upload-agent-direct-sale", command);
  }

  downloadAgentSummary(command){
    return this.httpHelper.apiPostSteam(this.apiUrl.urlDirectSale + "download-agent-summary", command);
  }

  getAgentSummary(command){
    return this.httpHelper.apiPost(this.apiUrl.urlDirectSale + "get-agent-sale-summary", command);
  }

  getOCOLockCurrentMonth(command) {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlDirectSale}oco-Lock-month`,
      loadParams: command,
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.method = 'POST'
      }
    })
  }

  updatelockcurrentMonth(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlDirectSale + "update-lockcurrentmonth", command);
  }

  uploadSSDForecast(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlDirectSale + "upload-ssd-forecast", command);
  }
  getDirectSaleReport(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlDirectSale + "directsale-report",command);
  }
}
