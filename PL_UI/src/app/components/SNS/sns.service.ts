import { Injectable } from '@angular/core';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
@Injectable({
  providedIn: 'root'
})
export class SnsService {
  constructor(private httpHelper: HttpModuleService,private apiUrl: ApiconstantService) { }

  archivedata(command) {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlSNS}archive-data`,
      loadParams: command,
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.method = 'POST'
      }
    })
  }
  archive(month:number,type:string){
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "archive/"+month+"/"+type, null);
  }
  uploadSnsData(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "upload-sns-entry", command);
  }

  rollingInventoryBP(accountCode:string) {
    return this.httpHelper.apiGet(this.apiUrl.urlSNS + "rollingInventory-sns-bp/"+accountCode, null);
  }
  snsdownload(command) {
    return this.httpHelper.apiPostSteam(this.apiUrl.urlSNS + "download-sns-entry", command);
  }

  getSNSSummary(command){
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "get-sns-summary", command);
  }
   //SNS – Stock Pricing
  uploadStockPrice(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "upload-sns-price", command);
  }

  getSNSPlanning(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "get-sns-planning", command);
  }

  updateSNSPlanning(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "update-sns-planning", command);
  }

  runPriceProcess(month:number){
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "run-price-process/"+month, null);

  }
  //sns-planning-comment
  addPlanningCommnet(command){
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "sns-planning-comment", command);
  }

  getPlanningComment(command)
  {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS+"get-planning-comment/", command);
  }
  triggerClosing(type)
  {
    return this.httpHelper.apiGet(this.apiUrl.urlSNS+"trigger-month-closing/"+type, null);
  }
 insertResultMonthpurchase()
  {
    return this.httpHelper.apiGet(this.apiUrl.urlSNS+"trigger-result-purchase", null);
  }
  updateConsignee(accountCode)
  {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS+"update-consignee/"+accountCode, null);
  }
  getPlannedCustomer(command:any)
  {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS+"get-planned-customer", command);
  }
  //sns-mapping
  addDeleteSnsMapping(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlSNS + "add-snsMapping", command);
  }
  addSnsMapping(accountCode) {
    return this.httpHelper.apiGet(this.apiUrl.urlSNS + "map-model/"+accountCode, null);
  }
  getSNSmappingList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlSNS}sns-mapping`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  
}
