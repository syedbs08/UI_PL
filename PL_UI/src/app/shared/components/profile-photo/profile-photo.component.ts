import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import { protectedResources } from 'src/app/configs/auth-config';
import { AuthenticationService } from '../../services/authentication.service';
import { GraphService, ProviderOptions } from '../../services/graph.service';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnChanges, OnInit {
  @Input() userObjectId: any;
  @Input() DisplayName: any;
  @Input() UserPrincipalName: any;
  @Input() smallSize: boolean = true;
  userPhoto: any;
  roles: any;

  constructor(private authService: MsalService,
    private graphService: GraphService,
    private domSanitize: DomSanitizer
  ) { }

  ngOnInit(): void {


  }
  ngOnChanges() {

    const providerOptions: ProviderOptions = {
      account: this.authService.instance.getActiveAccount()!,
      scopes: protectedResources.graphMe.scopes,
      interactionType: InteractionType.Redirect,
      endpoint: protectedResources.graphMe.endpoint,
    };
    if (this.userObjectId) {
      this.loadPhoto(providerOptions);
    }
    if (this.smallSize == false) {
      this.roles = providerOptions.account.idTokenClaims?.roles!;

    }


  }

  loadPhoto(providerOptions: ProviderOptions) {


    this.graphService
      .getGraphClient(providerOptions)
      .api('users/' + this.userObjectId + "/photo/$value")
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
        this.userPhoto = this.domSanitize.bypassSecurityTrustResourceUrl(
          urlCreator.createObjectURL(profileResponse)
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  setErrorImage(event: any) {
    event.target.src = './assets/images/users/nopic.png';
  }

}
