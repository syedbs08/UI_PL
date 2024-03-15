import { Injectable } from '@angular/core';
import configData from '../../../assets/config/config.json';
@Injectable({
  providedIn: 'root'
})
export class ApiconstantService {
  // public urlMaster: string = 'https://localhost:7049/api/v1/masters/';
  // public urlAuth: string = 'https://localhost:7049/api/v1/authentication/';

  public urlAuth: string = configData.urlAuth;
  public urlMaster: string =configData.urlMaster;
  public urlDirectSale: string =configData.urlDirectSale;
  public urlAttachment: string = configData.urlAttachment;
  public urlSNS: string = configData.urlSNS;
  public urlAdjustment: string = configData.urlAdjustment;
  public urlCOG: string = configData.urlCOG;
  public urlTransmission: string =configData.urlTransmission;
  public urlReport: string = configData.urlReport;
  //  public urlMaster: string = 'https://10.101.2.133:80/api/v1/masters/';
  // public urlAuth: string = 'https://10.101.2.133:80/api/v1/authentication/';


  constructor() { }
}

