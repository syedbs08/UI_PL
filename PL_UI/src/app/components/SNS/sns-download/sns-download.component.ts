import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCategory } from 'src/app/shared/models/product-category.model';
import { ProductcategoryService } from '../../masters/productcategory-master/productcategory.service';
import { MasterserviceService } from '../../masters/masterservice.service';
import Swal from 'sweetalert2';
import { S } from '@angular/cdk/keycodes';
import { DxDataGridComponent } from 'devextreme-angular';
import { SnsService } from '../sns.service';
import { DatePipe } from '@angular/common';
import { SnsEntriesDownloadResult } from 'src/app/shared/models/sns-entries-download-result.model';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';
import { default as _rollupMoment, Moment } from 'moment';
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
  selector: 'app-sns-download',
  templateUrl: './sns-download.component.html',
  styleUrls: ['./sns-download.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SnsDownloadComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  snsdownloadform: FormGroup;
  customerMultiSelectSettings = {};
  accountList: any;
  loading = false;
  countryList: any;
  companyList: any;
  getCustomerType = [
    { id: true, name: 'Collabo' },
    { id: false, name: 'Non-Collabo' },
  ];
  customerList: any;
  productCategoryList: any;
  productSubCategoryList: any;
  ocoLockMonthGrid: any;
  visible: boolean = false
  Oco_Lock_MonthFileName = "CurrentMonthLock" + new Date().toDateString();
  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;
  searching: boolean = false;
  snsEntryList: SnsEntriesDownloadResult[] = [];
  shpwGridPanel: boolean = false;
  error: string = "";
  fileName = "SNS_Download_" + new Date().toDateString();
  fromMonth = new FormControl(moment());
  toMonth = new FormControl(moment());
  constructor(
    private cdr: ChangeDetectorRef,
    private readonly productcategoryService: ProductcategoryService,
    private readonly masterService: MasterserviceService, private readonly snsservice: SnsService,
    private _fBuilder: FormBuilder, private datePipe: DatePipe) {
    this.masterService.getGlobalConfigByKey("PSI_YEAR").subscribe(x => {
      this.fromMonth = new FormControl(moment(x + '04', 'YYYYMM'));
      this.toMonth = new FormControl(moment(x + 1 + '03', 'YYYYMM'));
    })
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.customerMultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Select customers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit: 1
    };
    this.BindDDL();
    this.getProductCategoryList();
  }

  CollapsetoggleList8() {
    this.isCollapsedList8 = !this.isCollapsedList8;
  }

  getProductCategoryList() {
    this.productcategoryService.getUserMgs(2).subscribe({
      next: (data) => {
        this.productCategoryList = data.map(el => {
          return {
            id: el.id,
            itemName: el.productCategoryCode + '-' + el.name
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.productSubCategoryList = [];
  }

  BindDDL() {
    this.masterService.getCompanies().subscribe(s => {
      this.companyList = s.map(m => { return { companyName: m.companyCode + "-" + m.companyName, companyId: m.companyId } })
    });
    this.masterService.userCountryLookup().pipe()
      .subscribe(s => {
        this.countryList = s.map(el => {
          return {
            countryName: el.countryCode + "-" + el.countryName,
            countryId: el.countryId,
            id: el.countryId,
            itemName: el.countryCode + '-' + el.countryName
          }
        });
      });

    this.BindAccountList();
  }

  getProductSubCategoryList(selectedsubcat) {
    if (selectedsubcat != null) {
      this.productSubCategoryList = [];
      const productCategoryId = selectedsubcat ? selectedsubcat.map(c => c.id).join(',') : '0';

      if (productCategoryId) {

        this.productcategoryService.getUserMgs(3).subscribe({
          next: (data) => {
            this.productSubCategoryList = data.filter(x => {
              const parentIds = x.parentId.split(',');
              return productCategoryId.split(',').some(id => parentIds.includes(id));
            });
            this.productSubCategoryList.forEach((item) => {
              item.itemName = `${item.productCategoryCode}-${item.name}`;
            });
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }
  }
  chosenFromYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.fromMonth.value!;
    ctrlValue.year(normalizedYear.year());
    this.fromMonth.setValue(ctrlValue);
  }
  chosenToYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.toMonth.value!;
    ctrlValue.year(normalizedYear.year());
    this.toMonth.setValue(ctrlValue);
  }
  chosenFromMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.fromMonth.value!;
    ctrlValue.month(normalizedMonth.month());
    this.fromMonth.setValue(ctrlValue);
    datepicker.close();
  }
  chosenToMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.toMonth.value!;
    ctrlValue.month(normalizedMonth.month());
    this.toMonth.setValue(ctrlValue);
    datepicker.close();
  }
  initializeFormControl() {
    this.snsdownloadform = this._fBuilder.group({

      oacAccountId: new FormControl(null, [Validators.required]),
      //oacAccountId:[Validators.required],
      country: [],
      customer: [],
      productcategory: [],
      productsubcategory: [],
      saleSubType: new FormControl('Monthly', [Validators.required]),
    });


  }

  BindAccountList() {

    this.masterService.getAccounts().pipe()
      .subscribe(data => {


        data.forEach(element => {
          element.displaytext = element.accountCode + '-' + element.accountName
        });

        this.accountList = data;
      }

      );

  }
  accountChange() {
    this.snsdownloadform.patchValue({
      customer: null,
      country: null
    })
  }


  loadCustomer(selectedCountries) {
    if (selectedCountries != null) {
      let formValue = this.snsdownloadform.getRawValue();
      //const countryIdList = formValue.country.map(c => { return c.countryId });
      const countryIdList = selectedCountries ? selectedCountries.map(c => c.countryId).join(',') : '0';

      this.masterService.getcustomerbyoacandcountry(formValue.oacAccountId, countryIdList)
        .pipe()
        .subscribe({
          next: (x) => (
            this.customerList = x.map(el => {
              return {
                customerCode: el.customerCode,
                customerName: el.customerCode + '-' + el.customerName,
                id: el.customerId,
                itemName: el.customerCode + '-' + el.customerName
              }
            })
          ),
          error: (x) => (console.log(x))
        });
    }
  }
  get f() { return this.snsdownloadform.controls; }

  clearnScreen() {

    this.snsdownloadform.reset();
    this.visible = false;
  }

  onSearch() {
    if (!this.snsdownloadform.valid) {
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    if (!this.fromMonth) {
      return;
    }
    if (!this.toMonth) {
      return;
    }
    this.snsEntryList = [];
    this.shpwGridPanel = false;
    const formValue = this.snsdownloadform.getRawValue();
    this.searching = true;
    this.error = '';
    const formData = new FormData();
    formData.append("CountryCode", formValue.country ? formValue.country.map(c => c.countryId).join(',') : 'null');
    formData.append("OACCode", this.accountList.find(item => item.accountId === formValue.oacAccountId)?.accountCode);
    formData.append("CustomerCode", formValue.customer ? formValue.customer.map(c => c.customerCode).join(',') : 'null');
    formData.append("ProductCategoryId", formValue.productcategory ? formValue.productcategory.map(c => c.id).join(',') : 'null');
    formData.append("ProductSubCategoryId",formValue.productsubcategory ? formValue.productsubcategory.map(c => c.id).join(',') : 'null');
    formData.append("SaleSubType", formValue.saleSubType);
    formData.append("FromMonth", moment(this.fromMonth.value).format('YYYYMM'));
    formData.append("ToMonth", moment(this.toMonth.value).format('YYYYMM'));
    this.snsservice.getSNSSummary(formData)
      .pipe()
      .subscribe({
        next: this.handleSearchSuccess.bind(this),
        error: this.handleSearchError.bind(this)
      });
  }

  handleSearchSuccess(data: any) {
    this.searching = false;
    if (data.isSuccess) {
      this.snsEntryList = data.value;
      this.shpwGridPanel = true;
      this.visible = true;
    }
    else {
      this.error = data.errors.join(". ");
      Swal.fire('Error', "Problem occured while searching Direct Sales, kindly review error message", 'error');
    }
  }

  handleSearchError(error: any) {
    Swal.fire('Error', "Problem occured while searching Direct Sales, kindly review error message", 'error');
    this.error = error.Message;
    this.searching = false;
  }
  onDownload() {
    if (!this.snsdownloadform.valid) {
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    if (!this.fromMonth) {
      return;
    }
    if (!this.toMonth) {
      return;
    }
    const formValue = this.snsdownloadform.getRawValue();
    this.loading = true;
    //this.error = '';
    const formData = new FormData();
    formData.append("CountryCode", formValue.country ? formValue.country.map(c => c.countryId).join(',') : 'null');
    formData.append("OACCode", this.accountList.find(item => item.accountId === formValue.oacAccountId)?.accountCode);
    formData.append("CustomerCode", formValue.customer ? formValue.customer.map(c => c.customerCode).join(',') : 'null');
    formData.append("ProductCategoryId", formValue.productcategory ? formValue.productcategory.map(c => c.id).join(',') : 'null');
    formData.append("ProductSubCategoryId",formValue.productsubcategory ? formValue.productsubcategory.map(c => c.id).join(',') : 'null');
    formData.append("SaleSubType", formValue.saleSubType);
    formData.append("IsDownload", "true");
    formData.append("FromMonth", moment(this.fromMonth.value).format('YYYYMM'));
    formData.append("ToMonth", moment(this.toMonth.value).format('YYYYMM'));
    this.snsservice.snsdownload(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }


  handleSuccess(data: any) {
    const contentDisposition = data.headers.get('content-disposition');
    let fileName = '';
    // Extract the file name
    if (contentDisposition) {
      fileName = contentDisposition
        .split(';')[1]
        .split('filename')[1]
        .split('=')[1]
        .trim();
    }
    const formValue = this.snsdownloadform.getRawValue();
    if (!fileName) {
      // const selectedCustomer = this.customerList.find(c=> c.customerId == formValue.CustomerId);
      const selectedProdCategory = "SNS_Download_";
      fileName = `${selectedProdCategory}-${this.datePipe.transform(new Date(), 'MMMyyyy')}.xlsx`;
    }

    var blob = new Blob([data.body]);
    let saveAs = require('file-saver');


    saveAs(blob, fileName);
    this.loading = false;
  }

  handleError(error: any) {
    if (error['Message'] == "<ul></ul>") {
      Swal.fire('Error', "No Data found.", 'error');
    }
    else {
      Swal.fire('Error', "Problem occured while downloading sns.", 'error');
    }
    //this.error = error.Message;
    this.loading = false;
  }


}
