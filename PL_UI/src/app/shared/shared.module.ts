import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { NotificationSidemenuComponent } from './components/notification-sidemenu/notification-sidemenu.component';
import { HeaderBreadcrumbComponent } from './components/header-breadcrumb/header-breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TabToTopComponent } from './components/tab-to-top/tab-to-top.component';
import { FullContentComponent } from './components/layouts/full-content/full-content.component';
import { ErrorStyleComponent } from './components/layouts/error-style/error-style.component';
import { ContentStyleComponent } from './components/layouts/content-style/content-style.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { FullscreenToggleDirective } from './directives/fullscreen-toggle.directive';
import { ToggleThemeDirective } from './directives/toggle-theme.directive';
import { SidemenuToggleDirective } from './directives/sidemenuToggle';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { CloseSwitcherDirective } from './directives/close-switcher.directive';
import { ProfilesHeaderComponent } from './components/profiles-header/profiles-header.component';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { OnlynumberDirective } from './helpers/allow_number.directive';
import { NumericDirective } from './helpers/allow_decimal.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { DxDataGridModule,DxDropDownBoxModule,DxTreeViewModule } from 'devextreme-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ArchwizardModule } from 'angular-archwizard';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from "angular-datatables";
import { MatTabsModule } from '@angular/material/tabs';
import { UserlockComponent } from './components/userlock/userlock.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaximizeDirective } from "../shared/directives/maximize.directive";
import { DxCheckBoxModule } from 'devextreme-angular';
import {MatTableModule} from '@angular/material/table';
import { BlockUIModule } from 'ng-block-ui';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    LoaderComponent,
    SwitcherComponent,
    NotificationSidemenuComponent,
    HeaderBreadcrumbComponent,
    TabToTopComponent,
    FullContentComponent,
    ErrorStyleComponent,
    ContentStyleComponent,
    TabToTopComponent,
    FullscreenToggleDirective,
    ToggleThemeDirective,
    SidemenuToggleDirective,
    HoverEffectSidebarDirective,
    CloseSwitcherDirective,
    ProfilesHeaderComponent,
    ProfilePhotoComponent,
    UserprofileComponent,
    OnlynumberDirective,
    NumericDirective,
    UserlockComponent,
    MaximizeDirective
  
  ],
  imports: [
    CommonModule,
    RouterModule,
    PerfectScrollbarModule,
    NgbModule,
    FormsModule,    
    NgSelectModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    ColorPickerModule,
    NgxDaterangepickerMd.forRoot(),
    NgxMaterialTimepickerModule,
    AngularMultiSelectModule,
    AngularDualListBoxModule,
    NgxIntlTelInputModule,
    CKEditorModule,
    AngularEditorModule,
    QuillModule,
    ToastrModule.forRoot(),
    ArchwizardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    DataTablesModule,
    MatProgressBarModule,
    MatTreeModule,
    MatTabsModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    MatTableModule,
    DxCheckBoxModule,
    
    BlockUIModule.forRoot()
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
     
    },
    ToastrService
  ],
  exports:[
    FullContentComponent,
    ErrorStyleComponent,
    ContentStyleComponent,
    HeaderBreadcrumbComponent,
    TabToTopComponent,
    LoaderComponent,
    ProfilePhotoComponent,
    UserprofileComponent,
    PerfectScrollbarModule,
    NgbModule,
    FormsModule,
    ColorPickerModule,
    NgSelectModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    ColorPickerModule,   
    NgxMaterialTimepickerModule,
    AngularMultiSelectModule,
    AngularDualListBoxModule,
    NgxIntlTelInputModule,
    CKEditorModule,
    AngularEditorModule,
    QuillModule,  
    ArchwizardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    DxDataGridModule,
    DxTreeViewModule,
    DxDropDownBoxModule,
    DataTablesModule,
    MatProgressBarModule,
    MatTreeModule,
    MatTabsModule, 
    OnlynumberDirective,
    NumericDirective,
    MatDatepickerModule,
    MaximizeDirective,
    MatTableModule,
    DxCheckBoxModule,
    BlockUIModule
  ]
})
export class SharedModule { }
