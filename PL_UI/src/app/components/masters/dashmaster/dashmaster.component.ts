import { Component, OnInit, ViewChild } from '@angular/core';
import { DashmasterService } from './dashmaster.service';
import { lastValueFrom } from 'rxjs';

import { exportDataGrid } from 'devextreme/excel_exporter';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { LoadOptions } from 'devextreme/data';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DxDataGridComponent } from 'devextreme-angular';
import { execFile } from 'child_process';
import saveAs from 'file-saver';
import { date } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-dashmaster',
  templateUrl: './dashmaster.component.html',
  styleUrls: ['./dashmaster.component.scss']
})
export class DashmasterComponent implements OnInit {
  dashMainView: any;
  dashMonthly: any;
  customDataSource: DataSource;
  dashMasterFileName="Dashmaster_"+new Date().toDateString();
  dashMasterMonthlyFileName="DashmasterMonthly_"+new Date().toDateString();
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  constructor(private readonly dashmasterService: DashmasterService,
    private http: HttpClient) {
    this.dashMainView = this.dashmasterService.getDashHeader();

    this.loadMonthlyData();

  }

  ngOnInit(): void {
      this.dashMonthly = this.dashmasterService.getDashMonthly();

  }
  loadMonthlyData() { // example for custom url
    // const isNotEmpty = (value: unknown) => value !== undefined && value !== null && value !== '';

    // var customeFilter = {
    //   MaterialCode: !String,
    //   CustomerName: !String,
    //   SalesCompany: !String,
    //   SupplierCode: !String,
    //   IsActive: !Boolean
    // };
    // this.customDataSource = new DataSource({

    //   store: new CustomStore({

    //     load: (loadOptions: LoadOptions) => {
    //       let params: HttpParams = new HttpParams();

    //       [
    //         'filter',
    //         'group',
    //         'groupSummary',
    //         'parentIds',
    //         'requireGroupCount',
    //         'requireTotalCount',
    //         'searchExpr',
    //         'searchOperation',
    //         'searchValue',
    //         'select',
    //         'sort',
    //         'skip',
    //         'take',
    //         'totalSummary',
    //         'userData',
    //         'MaterialCode',
    //         'CustomerName',
    //         'SalesCompany',
    //         'SupplierCode',
    //         'IsActive'


    //       ].forEach(function (i) {
    //         const optionValue = loadOptions[i as keyof LoadOptions];
    //         if (i in loadOptions && isNotEmpty(optionValue) ) {
    //           params = params.set(i, JSON.stringify(optionValue));

    //           if (i === "filter" && isNotEmpty(optionValue)) {
    //             if (optionValue[0] === "matericalCode") {
    //               customeFilter.MaterialCode = optionValue[2];
    //             }
    //             else if (optionValue[0] === "customerName") {
    //               customeFilter.CustomerName = optionValue[2];
    //             }
    //             else if (optionValue[0] === "salesCompany") {
    //               customeFilter.SalesCompany = optionValue[2];
    //             }
    //             else if (optionValue[0] === "supplierCode") {
    //               customeFilter.SupplierCode = optionValue[2];
    //             }
    //             else if (optionValue[0] === "isActive") {
    //               customeFilter.IsActive = optionValue[2];
    //             }
    //           }
    //           if(i==="MaterialCode")
    //           {
    //              params.set(i, customeFilter.MaterialCode);
    //           }
    //           if(i==="CustomerName")
    //           {
    //              params.set(i, customeFilter.CustomerName);
    //           }
    //           if(i==="SalesCompany")
    //           {
    //              params.set(i, customeFilter.SalesCompany);
    //           }
    //           if(i==="SupplierCode")
    //           {
    //              params.set(i, customeFilter.SupplierCode);
    //           }
    //           if(i==="IsActive")
    //           {
    //              params.set(i, customeFilter.IsActive);
    //           }
    //         }


    //       });

    //       return lastValueFrom(
    //         this.http.get(
    //           'https://localhost:7049/api/v1/masters/dash-monthly',
    //           { params }
    //         )
    //       ).then((response: any) => {
    //         return {
    //           data: response?.data,
    //           totalCount: response?.totalCount,
    //           summary: response?.summary,
    //           groupCount: response?.groupCount,
    //         };
    //       }).catch(() => {
    //         throw 'Data loading error';
    //       });
    //     },

    //   }),
    // });

  }
  customizeText(info){
    if(info.value==true)
    return 'Y'  ;
    else
    return 'N';
}

//get value on filter change example
  onOptionChanged(e: any) {
    if (e.name === "columns" && e.fullName.endsWith("filterValues")) {
        const colIndex = parseInt(e.fullName.match(/\[\d+\]/)[0].replace("[", "").replace("]", ""));
        const values = e.component.columnOption(colIndex, "filterValues");
        //loop through values to find the required value and perform your action
    }
}


}
