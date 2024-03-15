import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DxDataGridComponent,
  DxDataGridModule,
  DxSelectBoxModule,
  DxCheckBoxModule
} from 'devextreme-angular';

import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { MasterserviceService } from '../masterservice.service';
@Component({
  selector: 'app-devextreamtable',
  templateUrl: './devextreamtable.component.html',
  styleUrls: ['./devextreamtable.component.scss']
})
export class DevextreamtableComponent implements OnInit {


  dataSource: any;



  public isCollapsed8 = false;
  public isClosed8 = false;
  constructor(    private readonly masterService: MasterserviceService) {

    this.dataSource = this.masterService.getDevgridSample("countryId");

  }

onCountrySelectDelete(country){
  alert(country);
}
onEdiCountry(data) {
 alert(data);
}

  ngOnInit(): void {
  }


}
