import { Injectable } from '@angular/core';
import { HttpModuleService } from '../helpers/http-client-service';
import { ApiconstantService } from '../helpers/apiconstant.service';
import { Observable, delay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserblockService {

  constructor(private http: HttpClient,
    private apiUrl: ApiconstantService) { }   
    checkBlock(pageBlock:string[]): Observable<any>{  
      return this.http.get<any>(this.apiUrl.urlMaster + "check-lock-screen/"+pageBlock).pipe(delay(1000));
   
    } 
}
