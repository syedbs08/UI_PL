import { Injectable } from '@angular/core';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { filter } from 'rxjs';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class MasterserviceService {

  constructor(private httpHelper: HttpModuleService,
    private apiUrl: ApiconstantService) { }

  addUpdateCompany(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-company", command);
  }
  getCompanies() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-companies", null);
  }
  getComapnyList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}company-master`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  getCompanyById(id: number) {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "company-by-id/" + id, null);
  }
  companyDelete(id: number) {
    return this.httpHelper.apiDelete(this.apiUrl.urlMaster + "delete-company/" + id + "", null)
  }
  addUpdateCountry(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-country", command);
  }
  getCountryCountry() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}country-master`,
      onBeforeSend(method, ajaxOptions) {
       
      },
    })
  }
  userCountryLookup() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-user-country", null);
  }
  
  countryLookup() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-allcountry", null);
  }
  countryLookupByDepartment(departmentId:any) {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-country-by-department/"+departmentId+"", null);
  }
  countryDelete(id: number) {
    return this.httpHelper.apiDelete(this.apiUrl.urlMaster + "delete-country/" + id + "", null)
  }
  //region master
  addUpdateRegion(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-region", command)
  }
  getRegionList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}region-master`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  regionDelete(id: number) {
    return this.httpHelper.apiDelete(this.apiUrl.urlMaster + "delete-region/" + id + "", null)
  }
  getMenus() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlAuth}menu-list`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  getMenuLookup() {
    return this.httpHelper.apiGet(this.apiUrl.urlAuth + "menu-lookup", null);
  }
  getRoles() {
    return this.httpHelper.apiGet(this.apiUrl.urlAuth + "get-roles", null);
  }
  syncUser() {
    return this.httpHelper.apiGet(this.apiUrl.urlAuth + "user-sync", null);
  }
  addMenus(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlAuth + "manage-menus", command);
  }
  getUsers() {
    //return this.httpHelper.apiPost(this.apiUrl.urlAuth + "app-users", command);
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}app-users`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  getUsersAll() {
    //return this.httpHelper.apiPost(this.apiUrl.urlAuth + "app-users", command);
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}app-users-all`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  
  getAllUsersByCountryId(countryd: number) {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-users-by-countryId/" + countryd + "", null);
  }
  
  getAllUsersByCountry(countryd: number) {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-users-country/" + countryd + "", null);
  }
  //currency master
  getCurrencyList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}currency-master`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  getCurrency() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-currency", null);

  }

  //Department master
  getDepartmentList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}department-master`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  addDepartment(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-department", command);
  }
  deparmentDelete(id: number) {
    return this.httpHelper.apiDelete(this.apiUrl.urlMaster + "delete-department/" + id + "", null)
  }
  getdepartmentLookup() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-departmentlookUp", null);
  }
  userRoleMapping(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlAuth + "map-roles", command);

  }
  adduserdepartmentMapping(commond)
  {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster+"map-userDepartment",commond);
  }
  getuserdepartmentMapping(userId)
  {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster+"get-userDepartmentmap/"+userId, null);
  }
  adduserproducttMapping(commond)
  {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster+"map-userproduct",commond);
  }

  UploadCurrency(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "currency-import", command);

  }
  //productCategory master
  getProductCategory() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "productcategories", null);
  }
  getMG1() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-mg1", null);

  }
  getMGsbyProductCategoryAndCategoryLevel(id: number, level: number) {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-mgs-by-productid-categorylevel/" + id + "/" + level + "", null);

  }
  addeditProductCategory(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-product-category", command);

  }
  downloadExcels(url: string, fileName: string) {
    return this.httpHelper.apiGetSteam(this.apiUrl.urlMaster + url + "/" + fileName, null);

  }
  downloadFile(fileName: string, filePath: string) {
    return this.httpHelper.apiGetSteam(this.apiUrl.urlAttachment + "downloads-file/"+ fileName+ "/" + filePath, null);

  }
  //psidates master

  getPSIDatesList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}psidate-master`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  UploadPSIDates(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "psidates-import", command);

  }
  //turnoverdays master
  getTurnoverdaysList() {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}trunoverday-master`,
      onBeforeSend(method, ajaxOptions) {
        
      },
    })
  }
  UploadTurnoverdays(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "turnoverdays-import", command);

  }
  //material master
 addUpdateMaterial(command) {
  return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-material", command)
}
getModelByCountryId(countryId) {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "model-by-countryId/"+countryId, null)
}
getMaterialList(primaryKey:any) {
  return AspNetData.createStore({
     key: primaryKey,
     loadUrl: `${this.apiUrl.urlMaster}materials`,
     onBeforeSend(method, ajaxOptions) {
       
     },
   })
 }
 getMaterialByCategorySubCategories(command) {
  return this.httpHelper.apiPost(this.apiUrl.urlMaster + "get-materials-by-mg1-and-mg2", command)
}
getMaterialByMG1MG2(mg1:number,mg2:number) {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-materials-by-mg1-and-mg2/"+mg1+"/"+mg2, null)
}
//supplier master
getSuppliers() {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-suppliers", null)
}

  //seaport master
  getSeaPorts() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-seaports", null)
  }

  //airport master
  getAirPorts() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-airports", null)
  }

  getDevgridSample(primaryKey: any) {
    return AspNetData.createStore({
      key: primaryKey,
      loadUrl: `${this.apiUrl.urlMaster}countries-devextream`,
      onBeforeSend(method, ajaxOptions) {
        
        // ajaxOptions.Filter=ajaxOptions.data.filter;
      },
    })
  }
//Product Master
getProductLookup() {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "productcategories", null)
}
getMG1Lookup() {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-mg1", null)
}

getuserProductMapping(userId)
{
  return this.httpHelper.apiGet(this.apiUrl.urlMaster+"get-userproductmap/"+userId, null);
}

  getRegions() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-regions", null)
  }
//salesoffice
getSalesOffices() {
return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-salesoffice", null)
}
//account
getAccounts() {
return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-account", null)
  }
  
//customer master
addUpdateCustomer(command) {
return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-customer", command)
}
getCollaboNonCollaboCustomersByUserCountryIds(customerType,countryId,saleTypeName){
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-collabo-noncollabo-customers-by-incharge-by-user-countryids/"+customerType+'/'+countryId+'/'+saleTypeName, null)
}
getCustomersByUserCountryIds(countryId){
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-customers-by-incharge-by-user-countryids/"+countryId, null)
}
getCustomersBySaleTypeId(saleTypeId){
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-customers-by-sale-typeids/"+saleTypeId, null)
}
getCollaboNonCollaboCustomers(customerType) {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-collabo-noncollabo-customers/"+customerType, null)
  }
getCustomers() {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-customers", null)
  }
getCollaboNonCollaboCustomersByIncharge(customerType: boolean) {
    return this.httpHelper.apiGet(`${this.apiUrl.urlMaster}get-collabo-noncollabo-customers-by-incharge/${customerType}`, null)
}

getCustomersByAccount(accountId: number) {
  return this.httpHelper.apiGet(`${this.apiUrl.urlMaster}get-customers-by-account/${accountId}`, null)
}

getCustomerList(primaryKey:any) {
return AspNetData.createStore({
   key: primaryKey,
   loadUrl: `${ this.apiUrl.urlMaster}customers`,
   onBeforeSend(method, ajaxOptions) {
     
   },
 })
}
//saleType
getSaleTypes() {
  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-saletype", null)
  }

  getcustomerbyoacandcountry(oacaccountid,countryId){
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-customer-by-oac-country/"+oacaccountid+'/'+countryId, null)
  }
  

 
  //global config
  getGlobalConfigByKey(type:string){
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "global-config-by-key/"+type, null);
  }
  getGlobalConfig(){
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "global-config", null);
  }
  updateGlobalConfig(salesType){
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "update-config/"+salesType, null);
  }
  //sales organization
  getSalesOrganization(){
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "salesOrganization-loopUp", null);
  }

  getMonths() {
    return this.httpHelper.apiGet(this.apiUrl.urlAttachment + "document-months", null);

  }
    GetFilesDetails(command) {
      return this.httpHelper.apiPost(this.apiUrl.urlAttachment + "document-folders", command);
  
    
  }
  getLockPSI(command) {
    return AspNetData.createStore({
      loadUrl: `${this.apiUrl.urlMaster}lock-psi`,
      loadParams: command,
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.method = 'POST'
      }
    })
  }
  addUpdateLockPSI(command) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-lock-psi", command);
  }
  addLockPIS(command,userId) {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-lock-psi/"+userId, command);
  }
  getActiveUsers(){
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "active-users", null);
  }
  getLockAllUser(isBlock){
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "lock-all-users/"+isBlock, null);
  }
  AddVariant(command)
  {
    return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-Variant", command);
  }
}
