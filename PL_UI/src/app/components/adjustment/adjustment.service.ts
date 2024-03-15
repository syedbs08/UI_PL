import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {

  constructor(private httpHelper: HttpModuleService,private apiUrl: ApiconstantService) { }
  uploadAdjustment(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlAdjustment + "upload-adjustment-entry", command);
  }
  
  getuploadAdjustmentData(command) {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlAdjustment}adjustment-upload-data`,
      loadParams: command,
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.method = 'POST'
      }
    })
  }
}
