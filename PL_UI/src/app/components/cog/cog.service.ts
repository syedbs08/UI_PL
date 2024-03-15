import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class COGService {

  constructor(private httpHelper: HttpModuleService,private apiUrl: ApiconstantService) { }
  uploadCOG(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlCOG + "upload-cog-entry", command);
  }
  
  getuploadCOGData(command) {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlCOG}cog-upload-data`,
      loadParams: command,
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.method = 'POST'
      }
    })
  }
}
