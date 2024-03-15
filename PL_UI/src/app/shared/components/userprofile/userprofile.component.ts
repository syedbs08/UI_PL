import { Component, Input, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import { protectedResources } from 'src/app/configs/auth-config';
import { GraphService, ProviderOptions } from '../../services/graph.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {
  @Input() userObjectId: any;
  @Input() assingDept: 0;
  @Input() assingProductMap: 0;
  userDetails: any;
  providerOptions: ProviderOptions
  roles: string[];
  constructor(private authService: MsalService,
    private graphService: GraphService) { }

  ngOnInit(): void {

  }
  ngOnChanges() {
    this.providerOptions = {
      account: this.authService.instance.getActiveAccount()!,
      scopes: protectedResources.graphMe.scopes,
      interactionType: InteractionType.Redirect,
      endpoint: protectedResources.graphMe.endpoint,
    };
    if (this.userObjectId && this.providerOptions) {
      this.getUserProfile();
    }

    this.roles = this.providerOptions.account.idTokenClaims?.roles!;


  }
  getUserProfile() {

    this.graphService
      .getGraphClient(this.providerOptions)
      .api('/users/' + this.userObjectId)
      .responseType(ResponseType.RAW)
      .get()
      .then((response: any) => {
        if (response.status === 200) return response.json();
        if (response.status === 401) {
          if (response.headers.get('WWW-Authenticate')) {
            this.graphService.handleClaimsChallenge(response, this.providerOptions);
          }
        }
      })
      .then((profileResponse: any) => {
        this.userDetails = profileResponse;
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  setErrorImage(event: any) {
    event.target.src = './assets/images/users/nopic.png';
  }
}
