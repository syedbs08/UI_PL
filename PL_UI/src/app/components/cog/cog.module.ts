import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { COGRoutingModule } from './cog-routing.module';
import { COGUploadComponent } from './cog-upload/cog-upload.component';


@NgModule({
  declarations: [
    COGUploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    COGRoutingModule
  ]
})
export class COGModule { }
