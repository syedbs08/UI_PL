import { Injectable } from '@angular/core';
import { HttpModuleService } from '../helpers/http-client-service';
import { ApiconstantService } from '../helpers/apiconstant.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { UserblockService } from './userblock.service';


@Injectable()  
export class UserblockresolverService implements Resolve<any> {  
  constructor(private userblockService: UserblockService,
     private router: Router) {}  
  
  resolve(route: ActivatedRouteSnapshot): Observable<any> { 
    const pageBlock: string[] = route ? route.data['pageBlock'] : []; 
    let myParam = pageBlock
    //let myParam = route.data['pageBlock']
    return this.userblockService.checkBlock(myParam);  
  }
}  
