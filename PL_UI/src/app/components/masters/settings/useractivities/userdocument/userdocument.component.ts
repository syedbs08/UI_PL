import { Component, OnInit } from '@angular/core';
import { MasterserviceService } from '../../../masterservice.service';
import * as _ from 'lodash';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { MsalService } from '@azure/msal-angular';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { FormControl } from '@angular/forms';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'YYYYMM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-userdocument',
  templateUrl: './userdocument.component.html',
  styleUrls: ['./userdocument.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class UserdocumentComponent implements OnInit {
  countryList: any;
  users: any;
  months: any;
  selectedUser: any;
  selectedMonth = new FormControl(moment());
  loading: boolean = false;
  searching: boolean = false;
  FolderFiles: any;
  submitted = false;
  Folders: any;
  noDataMessage: any;
  filteredFile: any;
  selectedFolder: any;
  roles: any;
  isSuperAdmin: boolean = false;
  constructor(private readonly masterService: MasterserviceService,
    private authService: MsalService) {
    this.selectedUser = null;
    this.masterService.getActiveUsers().pipe()
      .subscribe(s => {
        this.users = s;
      });
    this.masterService.getMonths().pipe()
      .subscribe(s => {
        this.months = s;
        this.months.forEach((item) => {
          item.Id = item,
            item.Name = item;
        });
      });
  }

  ngOnInit(): void {
    this.roles = this.authService.instance.getActiveAccount()?.idTokenClaims?.roles!;
    this.isSuperAdmin = this.roles.includes('OPSI_APPS_ADMIN') ||  this.roles.includes('SUPERADMIN') ? true : false;

  }
  onSearch() {
    this.noDataMessage = "";
    this.submitted = true;
    this.filteredFile = [];
    if (!this.selectedMonth) {
      return;
    }
    if (!this.selectedUser) {
      return;
    }
    this.loading = true;
    var command =
    {
      DocumentMonth: moment(this.selectedMonth.value).format('YYYYMM'),
      CreatedBy: this.selectedUser

    };
    this.masterService.GetFilesDetails(command).pipe()
      .subscribe(s => {
        this.FolderFiles = s;
        if (this.FolderFiles.length == 0) {
          this.noDataMessage = "No data found for selected criteria";
        }
        this.submitted = false;
        this.loading = false;
        this.Folders = _.uniqBy(this.FolderFiles, 'folderName');
      });


  }
  getMonthCount(folder) {
    return _.countBy(this.FolderFiles, o => o.folderName == folder).true

  }
  onFolderSelect(data) {

    this.filteredFile = _.filter(
      this.FolderFiles, function (o) {
        return o.folderName == data.folderName;
      });
    this.selectedFolder = data;
  }
  GoBack() {
    this.filteredFile = [];
    this.selectedFolder = null;

  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.selectedMonth.value!;
    ctrlValue.year(normalizedYear.year());
    this.selectedMonth.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.selectedMonth.value!;
    ctrlValue.month(normalizedMonth.month());
    this.selectedMonth.setValue(ctrlValue);
    datepicker.close();
  }
}
