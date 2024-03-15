import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';
import { LoginPageComponent } from './authentication/login-page/login-page.component';
import { RegisterComponent } from './authentication/register/register.component';
import { RoleGuard } from './configs/role.guard';
import { ContentStyleComponent } from './shared/components/layouts/content-style/content-style.component';
import { ErrorStyleComponent } from './shared/components/layouts/error-style/error-style.component';
import { FullContentComponent } from './shared/components/layouts/full-content/full-content.component';
import { custom_content } from './shared/routes/custom-content-router';
import { error_content } from './shared/routes/error-content-router';
import { full_content } from './shared/routes/full-content-router';

const routes: Routes = [

  {
    path: '', component: FullContentComponent, children: full_content,
    canActivate: [
      RoleGuard,
    ],
    data: {
      expectedRoles: ["OPSI_BASIC", "SUPERADMIN", "OPSI_SALES", "OPSI_PLANNING",
        "OPSI_MGMT", "OPSI_MKTG", "OPSI_REPORTS", "OPSI_SALES_HEAD", "OPSI_MKTG_HEAD", "OPSI_SSD",
        "OPSI_USER", "OPSI_TRANSMISSION", "OPSI_APPS_ADMIN"]
    }
  },
  { path: 'unathorised', component: LoginPageComponent },
  // { path: 'auth/register', component: RegisterComponent },

  { path: '', component: ErrorStyleComponent, children: error_content },
  { path: '', component: ContentStyleComponent, children: custom_content },
  { path: '**', redirectTo: '' }
];
const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    // Don't perform initial navigation in iframes
    initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
  })],
  exports: [RouterModule]
})
// @NgModule({
//   imports: [[RouterModule.forRoot(routes, {
//     anchorScrolling: 'enabled',
//     scrollPositionRestoration: 'enabled'
//   })],
// ],
//   exports: [RouterModule]
// })
export class AppRoutingModule { }
