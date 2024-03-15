import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  active: any;
  private readonly _destroying$ = new Subject<void>();
  isIframe = false;
  constructor(private msalBroadcastService: MsalBroadcastService,
    private authenticationService: AuthenticationService,

    private router: Router) {

     }

  ngOnInit(): void {
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    this.authenticationService.login(userFlowRequest);
  }
  initialLoading() {
    this.isIframe = window !== window.parent && !window.opener;
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });

  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
