import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterserviceService } from '../../masters/masterservice.service';
import { CustomerType } from 'src/app/shared/models/customer-type.model';
import { Customer } from 'src/app/shared/models/customer.model';
import { ProductCategory } from 'src/app/shared/models/product-category.model';
import Swal from 'sweetalert2';
import { DirectsalesService } from '../directsales.service';
import { CustomerTypeList } from 'src/app/shared/data/common/customer-type';
import { ProductcategoryService } from '../../masters/productcategory-master/productcategory.service';
import { SalesEntryDownloadResult } from 'src/app/shared/models/sales-entry-download-result.model';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
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
  selector: 'app-agent-summary-download',
  templateUrl: './agent-summary-download.component.html',
  styleUrls: ['./agent-summary-download.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AgentSummaryDownloadComponent implements OnInit {

  @Input() showheader=true;
  downloadForm: FormGroup;
  submitted: boolean = false;
  customerTypeList: CustomerType[] = CustomerTypeList;
  customerList: Customer[] = [];
  productCategoryList: ProductCategory[] = [];
  productSubCategoryList: ProductCategory[] = [];
  loading: boolean = false;
  searching: boolean = false;
  error: string = "";
  countryList: any[];
  companyList: any[];
  isClosedPanel: boolean = false;
  isCollapsedPanel: boolean = false;
  shpwGridPanel: boolean = false;
  salesList: SalesEntryDownloadResult[] = [];
  fromMonth = new FormControl(moment());
  toMonth = new FormControl(moment());
  constructor(private readonly masterService: MasterserviceService,
    private formBuilder: FormBuilder,
    private readonly directsalesService: DirectsalesService,
    private readonly productcategoryService:ProductcategoryService,
    private datePipe: DatePipe,
      ) { 
        this.masterService.getGlobalConfigByKey("PSI_YEAR").subscribe(x => {
          this.fromMonth = new FormControl(moment(x + '04', 'YYYYMM'));
          this.toMonth = new FormControl(moment(x+1 + '03', 'YYYYMM'));
        })
      }

  ngOnInit(): void {


    this.creatForm();
    this.getProductCategoryList();
    this.getCompanyList();
    this.getCountryList();
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
  creatForm(){
    this.downloadForm = this.formBuilder.group({
      CustomerType: new FormControl(null, [Validators.required]),
      CustomerId: new FormControl(null, [Validators.required]),
      ProductCategoryId: new FormControl(null, [Validators.required]),
      ProductSubCategoryId:new FormControl(null),
      SaleTypeId: new FormControl(1, [Validators.required]),
      SaleSubType: new FormControl('Monthly', [Validators.required]),
      IsUSDCurrency: new FormControl(false, [Validators.required]),
      //Product: new FormControl('Sub Group', [Validators.required]),
    });
  }

  get form() { return this.downloadForm.controls; }

  onCustomerTypeChange(){
    this.customerList = [];
    this.downloadForm.get('CustomerId')?.setValue(null);
    if(this.downloadForm.getRawValue().CustomerType){
      this.getCustomerList(this.downloadForm.getRawValue().CustomerType == 1);
    }
  }

  getCompanyList() {
    this.masterService.getCompanies()
      .subscribe({
        next: (data) => {
          this.companyList = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  getCountryList() {
    this.masterService.countryLookup()
      .subscribe({
        next: (data) => {
          this.countryList = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  getCustomerList(isCollabo: boolean){
    this.masterService.getCollaboNonCollaboCustomersByUserCountryIds(isCollabo,null,"Direct").subscribe({
      next: (data)=> {
        this.customerList = data.map(el => { return { customerId: el.customerId, customerName: el.customerCode + '-' + el.customerName, customerCode: el.customerCode } })
      },
      error: (error)=> {
        console.log(error);
      }
    });
  }

  getProductCategoryList() {
    this.productcategoryService.getUserMgs(2).subscribe({
      next: (data)=> {
        this.productCategoryList = data;
        this.productCategoryList.forEach((item)=> {
          item.displayName = `${item.productCategoryCode}-${item.name}`;
        });
      },
      error: (error)=> {
        console.log(error);
      }
    });
    this.productSubCategoryList=[];
  }

  getProductSubCategoryList(){
    this.productSubCategoryList = [];
    this.downloadForm.get('ProductSubCategoryId')?.setValue(null);
    const productCategoryId = this.downloadForm.getRawValue().ProductCategoryId;
    if(productCategoryId){
      this.productcategoryService.getUserMgs(3).subscribe({
        next: (data)=> {
          this.productSubCategoryList = data.filter(x=>x.parentId.split(',').map(Number).includes(productCategoryId));
          this.productSubCategoryList.forEach((item)=> {
            item.displayName = `${item.productCategoryCode}-${item.name}`;
          });
        },
        error: (error)=> {
          console.log(error);
        }
      });
    }
  }

  clearForm(){
    this.downloadForm.reset();
  }

  onSearch(){
    if(!this.downloadForm.valid){
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    if (!this.fromMonth) {
      return;
    }
    if (!this.toMonth) {
      return;
    }
    this.salesList = [];
    this.shpwGridPanel = false;
    const formValue = this.downloadForm.getRawValue();
    this.searching = true;
    this.error = '';
    const formData = new FormData();

    formData.append("CustomerId", formValue.CustomerId);
    formData.append("ProductCategoryId", formValue.ProductCategoryId);
    formData.append("ProductSubCategoryId", formValue.ProductSubCategoryId);
    formData.append("SaleSubType", formValue.SaleSubType);
    formData.append("SaleTypeId", formValue.SaleTypeId);
    formData.append("IsUSDCurrency", formValue.IsUSDCurrency);
    formData.append("FromMonth",  moment(this.fromMonth.value).format('YYYYMM'));
    formData.append("ToMonth",  moment(this.toMonth.value).format('YYYYMM'));
    //formData.append("Product", formValue.Product);
    this.directsalesService.getAgentSummary(formData)
      .pipe()
      .subscribe({
        next: this.handleSearchSuccess.bind(this),
        error: this.handleSearchError.bind(this)
      });
  }

  handleSearchSuccess(data: any) {
    this.searching = false;
    if(data.isSuccess){
      this.salesList = data.value;
      this.shpwGridPanel = true;
    }
    else{
      this.error = data.errors.join(". ");
      Swal.fire('Error', "Problem occured while searching Direct Sales, kindly review error message", 'error');
    }
  }

  handleSearchError(error: any) {
    Swal.fire('Error', "Problem occured while searching Direct Sales, kindly review error message", 'error');
    this.error = error.Message;
    this.searching = false;
  }
  
  onDownload(){
    if(!this.downloadForm.valid){
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    if (!this.fromMonth) {
      return;
    }
    if (!this.toMonth) {
      return;
    }
    const formValue = this.downloadForm.getRawValue();
    this.loading = true;
    this.error = '';
    const formData = new FormData();

    formData.append("CustomerId", formValue.CustomerId);
    formData.append("ProductCategoryId", formValue.ProductCategoryId);
    formData.append("ProductSubCategoryId", formValue.ProductSubCategoryId);
    formData.append("SaleSubType", formValue.SaleSubType);
    formData.append("SaleTypeId", formValue.SaleTypeId);
    formData.append("IsUSDCurrency", formValue.IsUSDCurrency);
    formData.append("IsDownload", "true");
    formData.append("Product", formValue.Product);
    formData.append("FromMonth",  moment(this.fromMonth.value).format('YYYYMM'));
    formData.append("ToMonth",  moment(this.toMonth.value).format('YYYYMM'));
    this.directsalesService.downloadAgentSummary(formData)
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
    if(contentDisposition){
      fileName = contentDisposition
        .split(';')[1]
        .split('filename')[1]
        .split('=')[1]
        .trim();
    }
    
    const formValue = this.downloadForm.getRawValue();
    if(!fileName){
      const selectedCustomer = this.customerList.find(c=> c.customerId == formValue.CustomerId);
      const selectedProdCategory = this.productCategoryList.find(c=> c.id == formValue.ProductCategoryId);
      fileName = `${selectedCustomer ? selectedCustomer.customerCode : ''}-${selectedProdCategory ? selectedProdCategory.name : ''}-${this.datePipe.transform(new Date(), 'MMMyyyy')}.xlsx`;
    }

    var blob = new Blob([data.body]);
    let saveAs = require('file-saver');
    saveAs(blob, fileName);
    this.loading = false;
  }

  handleError(error: any) {
   
    Swal.fire('Error', "Problem occured while downloading Direct Sales/ Data not found for the selected customer and product.", 'error');
    this.error = error.Message;
    this.loading = false;
  }

  collapseToggle() {
    this.isCollapsedPanel = !this.isCollapsedPanel;
  }

  onExporting(event){
    event.cancel = true;
    this.onDownload();
  }

}
