import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginPageComponent } from './authentication/login-page/login-page.component';
import { ColorPickerModule } from 'ngx-color-picker';

import { HTTP_INTERCEPTORS,HttpClient,HttpClientModule } from '@angular/common/http';
import {
   MsalBroadcastService, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE,
   MsalRedirectComponent,  MsalInterceptor, MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import { MSALGuardConfigFactory ,MSALInstanceFactory,MSALInterceptorConfigFactory} from './configs/auth-config';
import { RoleGuard } from './configs/role.guard';
import { ErrorInterceptor } from './shared/helpers/error.interceptor';
import devextremeAjax from 'devextreme/core/utils/ajax';
import { sendRequestFactory } from './shared/helpers/ng-http-client-helper';
import { DatePipe } from '@angular/common';
import { UserblockService } from './shared/services/userblock.service';
import { UserblockresolverService } from './shared/services/userblockresolver.service';
import { unSaveChangeGuard } from './shared/services/un-save-change.guard';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterComponent
  
     
 
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ColorPickerModule, 
    FormsModule,
    ReactiveFormsModule,
    MsalModule
  ],
  providers: [
    {
      //interceptor
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    //http errror interceptor
    { provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
       multi: true },
    {
      //azure ad initialization
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      //route gaurd
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      //protected reource
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    RoleGuard,
    MsalBroadcastService,
    DatePipe,
    UserblockService,
    UserblockresolverService ,
    unSaveChangeGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

  constructor(httpClient: HttpClient) {
    devextremeAjax.inject({ sendRequest: sendRequestFactory(httpClient) });
  }

}
