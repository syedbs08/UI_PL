import { Inject, Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest, AuthenticationResult } from '@azure/msal-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { GraphService, ProviderOptions } from './graph.service';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import { Profile } from '../models/profile';
const Graph_end_Point = "https://graph.microsoft.com/v1.0/me";
const Graph_end_Point_Pic = "https://graph.microsoft.com/v1.0/me/photo/$value";
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isUserLoggeIn: Subject<boolean> = new Subject<boolean>();
  profile!: Profile;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private httpclient: HttpClient,
    private graphService: GraphService,

    private domSanitize: DomSanitizer
  ) { }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
          
            this.authService.instance.setActiveAccount(response.account);
         
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect(userFlowRequest);
      }
    }
  }

  getProfile(providerOptions: ProviderOptions): Promise<any>
     {
    this.graphService
      .getGraphClient(providerOptions)
      .api('/me')
      .responseType(ResponseType.RAW)
      .get()

      .then((response: any) => {
        if (response.status === 200) return response.json();
        if (response.status === 401) {
          if (response.headers.get('WWW-Authenticate')) {
            this.graphService.handleClaimsChallenge(response, providerOptions);
          }
        }
      })
      .then((profileResponse: any) => {
        this.profile = profileResponse;
        this.profile.roles = providerOptions.account.idTokenClaims?.roles!;
        return Promise.resolve(this.profile)
      })
      .catch((error: any) => {
        console.log(error);
      });
      return Promise.resolve(this.profile)
      
  }
  getProfilePhoto(providerOptions: ProviderOptions) {
    this.graphService
      .getGraphClient(providerOptions)
      .api('me/photo/$value')
      .responseType(ResponseType.RAW)
      .get()
      .then((response: any) => {
        if (response.status === 200) return response.blob();
        if (response.status === 401) {
          if (response.headers.get('WWW-Authenticate')) {
            this.graphService.handleClaimsChallenge(response, providerOptions);
          }
        }
      })
      .then((profileResponse: any) => {
        var urlCreator = window.URL || window.webkitURL;
        this.profile.profilePhotos = this.domSanitize.bypassSecurityTrustResourceUrl(
          urlCreator.createObjectURL(profileResponse)
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  logout() {
    this.authService.logout();
  }

}