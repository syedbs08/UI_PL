import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpModuleService {

  constructor(
    private HttpClient: HttpClient
  ) { }
  apiPost(destinationUrl: string, param: any): Observable<any> {   
     
    return this.HttpClient.post<any>(destinationUrl, param);
     
  } 
  apiPut(destinationUrl: string, param: any): Observable<any> {   
     
    return this.HttpClient.put<any>(destinationUrl, param);
     
  } 
  apiDelete(destinationUrl: string, param: any): Observable<any> {   
    
    return this.HttpClient.delete<any>(destinationUrl);
   
  } 
  apiGet(destinationUrl: string, param: any): Observable<any> {     
    
    return this.HttpClient.get<any>(destinationUrl);
    
  } 
  apiGetSteam(destinationUrl: string, param: any): Observable<Blob> {  
    
    return this.HttpClient.get(destinationUrl, {responseType: 'blob'});
    
  } 

  apiPostSteam(destinationUrl: string, param: any): Observable<HttpResponse<Blob>> {  
    return this.HttpClient.post(destinationUrl, param, { responseType: 'blob', observe: 'response'});
  } 


}