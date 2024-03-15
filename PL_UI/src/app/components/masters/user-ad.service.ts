import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import { from, map, Observable, of } from 'rxjs';
import { protectedResources } from 'src/app/configs/auth-config';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
import { Profile } from 'src/app/shared/models/profile';
import { GraphService, ProviderOptions } from 'src/app/shared/services/graph.service';

@Injectable({
  providedIn: 'root'
})
export class UserADService {
  userList: any;
  constructor(
    private httpHelper: HttpModuleService,
    private apiUrl: ApiconstantService
   ) { }
   getUsers(searchItem) {
    return this.httpHelper.apiGet(this.apiUrl.urlAuth + "user-select/"+searchItem, null);
  }
}
