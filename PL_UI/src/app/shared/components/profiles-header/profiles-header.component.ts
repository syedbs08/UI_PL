import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  AuthenticationResult,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { InteractionType } from '@azure/msal-browser';

import { ResponseType } from '@microsoft/microsoft-graph-client';
import { GraphService, ProviderOptions } from '../../services/graph.service';
import { protectedResources } from 'src/app/configs/auth-config';
import { Profile } from '../../models/profile';
@Component({
  selector: 'app-profiles-header',
  templateUrl: './profiles-header.component.html',
  styleUrls: ['./profiles-header.component.scss'],
})
export class ProfilesHeaderComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();

  profilePic: any;
  profile!: Profile;

  constructor(
    private authService: MsalService,
    private graphService: GraphService,
    private msalBroadcastService: MsalBroadcastService,   
    private domSanitize: DomSanitizer,
    private authenticationService:AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authenticationService.checkAndSetActiveAccount();
    this.loadProfileSnap();
  }

  getProfile(providerOptions: ProviderOptions) {
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
      .then((profileResponse: Profile) => {       
        this.profile = profileResponse;
        this.profile.roles = providerOptions.account.idTokenClaims?.roles!;
      })
      .catch((error: any) => {
        console.log(error);
      });
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
  loadProfileSnap() {
    const providerOptions: ProviderOptions = {
      account: this.authService.instance.getActiveAccount()!,
      scopes: protectedResources.graphMe.scopes,
      interactionType: InteractionType.Redirect,
      endpoint: protectedResources.graphMe.endpoint,
    };

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.getProfile(providerOptions);
        this.getProfilePhoto(providerOptions);
       
      });
  }
  getAllUsers(providerOptions: ProviderOptions) {
    this.graphService
      .getGraphClient(providerOptions)
      .api('/users')
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
        
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  setErrorImage(event:any) {
    event.target.src = './assets/images/users/nopic.png';
}
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
