import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { AuthenticationService } from './shared/services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = false;
  isLoggedIn = false;
  private readonly _destroying$ = new Subject<void>();
  ngOnInit() {
    fromEvent(window, 'load').subscribe(() => document.querySelector('#glb-loader')?.classList.remove('loaderShow'));

  }

  materialDualListSource: any[] = []
  destination = []

  constructor(private msalBroadcastService: MsalBroadcastService,
    private authenticationService: AuthenticationService,
    private router: Router) {

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
       this.router.navigate(['/dashboard'])
      });


  }


  logout() {
    this.authenticationService.logout();
  }


  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
