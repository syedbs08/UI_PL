import { Injectable } from '@angular/core';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
@Injectable({
  providedIn: 'root'
})
export class TransmissionService {
  constructor(private httpHelper: HttpModuleService,
    private apiUrl: ApiconstantService) { }
  //transmission-list
  addDeleteTransmissionList(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlTransmission + "add-delete-transmission-list", command);
  }
  getTransmissionPlanType() {
    return this.httpHelper.apiGet(this.apiUrl.urlTransmission + "transmission-plan-type", null);
  }
  getTransmissionList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlTransmission}transmission-list`,
      onBeforeSend(method, ajaxOptions) {
      },
    })
  }

  //pretransmission
  addPreTransmissionList(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlTransmission + "add-pre-transmission-list", command);
  }
  getPreTransmissionCustomerList(command) {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlTransmission}pre-transmission-customer-list`,
      loadParams: command,
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.method = 'POST'
      }
    })
  }
  getTransmissionCustomerByPlanTypeBySaleType(planTypeCode: string, saletype: string) {
    return this.httpHelper.apiGet(this.apiUrl.urlTransmission + "transmission-customer-by-plantype-sale/" + planTypeCode + "/" + saletype, null);
  }
  addTransmit(plantype: string, resultMonth: string, customerCode: string, currentMonth: string, type: string) {
    return this.httpHelper.apiGet(this.apiUrl.urlTransmission + "transmit/" + plantype + "/" + resultMonth + "/" + customerCode + "/" + currentMonth + "/" + type, null);
  }
  getTransmitDataList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlTransmission}transmit-data-list`,
      onBeforeSend(method, ajaxOptions) {
      },
    })
  }
  UploadTransmit(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlTransmission + "upload-dash-transmit", command);

  }

  getDashtransmit() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlTransmission}dash-transmit`,
      onBeforeSend(method, ajaxOptions) {
      },
    })
  }
}
