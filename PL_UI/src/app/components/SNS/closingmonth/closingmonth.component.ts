import { Component, OnInit } from '@angular/core';
import { MasterserviceService } from '../../masters/masterservice.service';
import { SnsService } from '../sns.service';
import { error } from 'console';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { SNSUploadResult } from 'src/app/shared/models/sns-upload-result.model';
import { ErrorMsg} from 'src/app/shared/helpers/constants';
@Component({
  selector: 'app-closingmonth',
  templateUrl: './closingmonth.component.html',
  styleUrls: ['./closingmonth.component.scss']
})
export class ClosingmonthComponent implements OnInit {
  showUpdatePurchase = false;
  showUpdateConsignee = false;
  accounts: any;
  selectedAccount: any;
  closingTypes = [
    {
      name: "Current Purchase & Result GIT",
      type: "GIT",
      response: {
        sapCount: 0,
        insertedCount: 0,
        errorMessage: ""
      },
      triggered: "Not Triggered"
    },
    {
      name: "Current Order",
      type: "CurrentMonthOrder",
      response: {
        sapCount: 0,
        insertedCount: 0,
        errorMessage: ""
      }
      ,
      triggered: "Not Triggered"
    },

    {
      name: "Result Order",
      type: "ResultMonthOrder",
      response: {
        sapCount: 0,
        insertedCount: 0,
        errorMessage: ""
      }
      ,
      triggered: "Not Triggered"
    },
    {
      name: "Result Sales",
      type: "RESULTMONTHSALES",
      response: {
        sapCount: 0,
        insertedCount: 0,
        errorMessage: ""
      }
      ,
      triggered: "Not Triggered"
    },
    {
      name: "Result Purchase",
      type: "RESULTPURCHASE",
      response: {
        sapCount: 0,
        insertedCount: 0,

        errorMessage: ""
      }
      ,
      triggered: "Not Triggered"
    },
    // {
    //   name: "Current Purchase",
    //   type: "CurrentPurchase",
    //   response: {
    //     sapCount: 0,
    //     insertedCount: 0,
    //     errorMessage: ""
    //   },
    //   triggered: "Not Triggered"
    // },
    {
      name: "Lock Month Purchase & MPO",
      type: "LockMonthPurchaseAndMPO",
      response: {
        sapCount: 0,
        insertedCount: 0,
        errorMessage: ""
      },
      triggered: "Not Triggered"
    },
    {
      name: "Result Inventory & Blocked Inventory",
      type: "ResultMonthInventory",
      response: {
        sapCount: 0,
        insertedCount: 0,

        errorMessage: ""
      }
      ,
      triggered: "Not Triggered"
    },



  ];
  resultMonth: any;
  submitted = false;
  loading: boolean = false;
  globalConfig = {
    currentMonth: null,
    lockMonth: null,
    resultMonth: null
  }

  constructor(private masterService: MasterserviceService,
    private snsService: SnsService,
  ) {

    this.loadConfigMonths();
    this.masterService.getAccounts().subscribe(resp => {
      let accounts = ['00029956', '20609235', '20603421'];
      this.accounts = _.filter(resp, (v) => _.includes(accounts, v.accountCode));
    })
  }

  ngOnInit(): void {
  }
  loadConfigMonths() {
    this.masterService.getGlobalConfig().subscribe(x => {
      this.globalConfig.currentMonth = x.find(function (y) {
        return y.configKey === "Current_Month";
      })?.configValue;
      this.globalConfig.resultMonth = x.find(function (y) {
        return y.configKey === "Result_Month";
      })?.configValue;
      this.globalConfig.lockMonth = x.find(function (y) {
        return y.configKey === "Lock_Month";
      })?.configValue;
    })
  }
  onMonthChange() {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure ?',
      html: 'Config months will be chnaged and can not revert',
      showCancelButton: true,
      confirmButtonColor: '#7367f0',
      cancelButtonColor: '#f5334f',
      confirmButtonText: 'Yes',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;

        this.masterService.updateGlobalConfig("Monthly").subscribe(x => {
          this.loadConfigMonths();
          Swal.fire('Success', "Month changed successfully", 'success');
          this.loading = false;
        },
          error => {
            Swal.fire('Error', error.Message, 'error');
            this.loading = false;
          }

        );
      }
    })
  }

  onMonthClosingTrigger() {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure ?',
      html: 'Data will be triggered for result month ' + this.globalConfig.resultMonth,
      showCancelButton: true,
      confirmButtonColor: '#7367f0',
      cancelButtonColor: '#f5334f',
      confirmButtonText: 'Yes',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        var completedCount = 0;
        this.closingTypes.forEach(element => {
          if (element.type !== 'RESULTPURCHASE') {
            element.triggered = "In Progress";
            this.snsService.triggerClosing(element.type).subscribe(x => {
              element.response = x;
              element.triggered = (element.response.errorMessage && element.response.errorMessage.length > 0) ? element.response.errorMessage : "Completed";
              completedCount++;
              if (completedCount === this.closingTypes.length - 1) {
                this.showUpdatePurchase = true;
              }
            },
              error => {
                element.triggered = error.errorMessage
              }

            );
          }
        });
      }
    })

  }
  onResultMonthClick(item) {
    item.triggered = "In Progress";
    this.snsService.insertResultMonthpurchase().subscribe(x => {
      item.response = x;
      item.triggered = (item.response.errorMessage && item.response.errorMessage.length > 0) ? item.response.errorMessage : "Completed";
      this.showUpdateConsignee = true;
    },
      error => {
        item.triggered = error.errorMessage
      }

    );


  }

  onUpdateConsignee() {
    if (!this.selectedAccount) {
      return;
    }
    this.loading = true;
    this.snsService.updateConsignee(this.selectedAccount)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: any) {
    this.loading = false;
    if (data && data.isSuccess) {
      const responseMessages: SNSUploadResult[] = data.value;
      const serverErrorData = responseMessages.find(c => c.responseCode === '500');
        if (serverErrorData) {
          Swal.fire('Error', ErrorMsg, 'error');
         
        }else{
          Swal.fire('Success', "Consignee updated successfully ", 'success');
        }
    }
    else {
      Swal.fire('Error', ErrorMsg, 'error');
    }
  }
  handleError(error: any) {
    Swal.fire('Error', ErrorMsg, 'error');
    this.loading = false;
  }
}
