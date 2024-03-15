import { Component, OnInit,ViewChild } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer.model';
import { AdjustmentService } from '../adjustment.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {  Observable,  Subject } from 'rxjs';
import { AdjustmentUploadResult } from 'src/app/shared/models/adjustment-upload-result.model';
import { ProductcategoryService } from 'src/app/components/masters/productcategory-master/productcategory.service';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import { ActivatedRoute } from '@angular/router';
import { UserblockService } from 'src/app/shared/services/userblock.service';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ErrorMsg} from 'src/app/shared/helpers/constants';
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
  selector: 'app-adjusment-upload',
  templateUrl: './adjusment-upload.component.html',
  styleUrls: ['./adjusment-upload.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AdjusmentUploadComponent implements OnInit {
  // @ViewChild(UserlockComponent,{static:false} ) lock: UserlockComponent ; 
  gridBoxValue: number[] = [1];
  checkBlock: any;
  loading: boolean = false;
  files: File[] = [];
  rejectedFile: File[] = [];
  submitted = false;
  excelLoading = false;
  customerList: Customer[] = [];
  showError: boolean = false;
  minLengthTerm = 2;
  accountList: any;
  accountList$: Observable<any>;
  accountSearch$ = new Subject<string>();
  accountLoading: boolean = false;
  missingItems: AdjustmentUploadResult[] = [];
  showEntryScreen: boolean = false;
  selectedTabIndex: number = 0;
  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;
  showAddNewButton:boolean=true;
  showOtherButton:boolean=false;
  customerMultiSelectSettings = {};
  productCategoryId1MultiSelectSettings = {};
  productCategoryId2MultiSelectSettings = {};
  getCountry: any;
  getCustomer: any;
  getMG1: any;
  getMG2: any;
  dataList: any;
  fromMonth = new FormControl(moment());
  toMonth = new FormControl(moment());
  constructor(
    private readonly adjustmentservice: AdjustmentService,
    private _fBuilder: FormBuilder,
    private readonly productcategoryService: ProductcategoryService,
    private readonly masterService: MasterserviceService,
    private route: ActivatedRoute) { 
      this.masterService.getGlobalConfigByKey("PSI_YEAR").subscribe(x => {
        this.fromMonth = new FormControl(moment(x + '04', 'YYYYMM'));
        this.toMonth = new FormControl(moment(x+1 + '03', 'YYYYMM'));
      })
      this.loadCustomer();
      this.loadMG1();
    }

  ngOnInit(): void {
 
    this.showError = false;
    this.initializeFormControl();
  }

  searchForm:FormGroup;
  get f() { return this.searchForm.controls; }
  initializeFormControl() {
    this.searchForm = this._fBuilder.group({
      
      CustomerId: [],
      ProductCategoryId1: [],
      ProductCategoryId2: [],
    });

    this.productCategoryId1MultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Product Sub-Category",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit:1
    };

    this.productCategoryId2MultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Product Type",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit:1
    };

    this.customerMultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Select Customers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit:1
    };

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
  backButton(){
    this.reload();
   }

  onAddNewClick($event: boolean) {
    this.showEntryScreen = true;
    this.submitted=false;
    this.showAddNewButton=false;
    this.showOtherButton=true;
  }

  onSearch() {
    this.loading = true;
    this.submitted = true;
    if (!this.fromMonth) {
      return;
    }
    if (!this.toMonth) {
      return;
    }
    let formValue = this.searchForm.getRawValue();
    var selectedCustomerIdList = formValue.CustomerId ? formValue.CustomerId.map(c => { return c.customerId }) : [];
    var selectedProductCategoryId1List = formValue.ProductCategoryId1 ? formValue.ProductCategoryId1.map(c => { return c.id }) : [];
    var selectedProductCategoryId2List = formValue.ProductCategoryId2 ? formValue.ProductCategoryId2.map(c => { return c.id }) : [];

    var command = {
      CountryId:  "" ,
      CustomerId: selectedCustomerIdList ? (selectedCustomerIdList.length > 0 ? selectedCustomerIdList : []): [],  
      ProductCategoryId1: selectedProductCategoryId1List ? (selectedProductCategoryId1List.length > 0 ? selectedProductCategoryId1List : []): [],
      ProductCategoryId2: selectedProductCategoryId2List ? (selectedProductCategoryId2List.length > 0 ? selectedProductCategoryId2List : []): [],
      FromMonth: moment(this.fromMonth.value).format('YYYYMM'),
      ToMonth: moment(this.toMonth.value).format('YYYYMM'),
    }
    this.loaddata(command);
    this.loading = false;
    this.files = [];
  }
  loaddata(command){
    this.dataList = this.adjustmentservice.getuploadAdjustmentData(command);
  if (this.dataList && this.dataList.loadOptions && this.dataList.loadOptions.data) {
      // data property is not null
      this.Collapsetoggle8();
    }
  }
  loadCustomer() {
    this.masterService.getCustomersByUserCountryIds(null)
      .pipe()
      .subscribe({
        next: (x) => (
          this.getCustomer = x.map(el => { 
            return { 
             customerId: el.customerId,
             customerName: el.customerCode + '-' + el.customerName,
             id: el.customerId,
             itemName: el.customerCode + '-' + el.customerName
             } 
          })
        ),
        error: (x) => (console.log(x))
      });
  }
 
  loadMG1() {
    this.productcategoryService.getUserMgs(2).subscribe(x => {
      this.getMG1 = x;

      this.getMG1 = this.getMG1.map((item)=> {
        return{
          displayName : `${item.productCategoryCode}-${item.name}`,
          id: item.id,
          itemName: `${item.productCategoryCode}-${item.name}`,
          productCategoryCode : item.productCategoryCode
        }
      });

    });
    this.getMG2 = null;
  }

  loadMg2(mg1Ids: any) {
    var allMg2:any = null;
    this.productcategoryService.getUserMgs(3).subscribe(x => {
      mg1Ids.map( mg1Id =>{
        if(!allMg2 ){
          allMg2 = x.filter(x => x.parentId.split(',').map(Number).includes(mg1Id));
        }
        else{
          allMg2.push(x.filter(x => x.parentId.split(',').map(Number).includes(mg1Id)));
        }
      }
      );
    });

    allMg2.forEach((item)=> {
        item.displayName = `${item.productCategoryCode}-${item.name}`;
        item.itemName = `${item.productCategoryCode}-${item.name}`;
      });
      this.getMG2 = allMg2;
  }

  onMg1Select(selectedsubcat) {
    if (selectedsubcat != null) {
      this.getMG2 = [];
      const productCategoryId = selectedsubcat ? selectedsubcat.map(c => c.id).join(',') : '0';
      if (productCategoryId) {

        this.productcategoryService.getUserMgs(3).subscribe({
          next: (data) => {
            this.getMG2 = data.filter(x => {
              const parentIds = x.parentId.split(',');
              return productCategoryId.split(',').some(id => parentIds.includes(id));
            });
            this.getMG2.forEach((item) => {
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

  onRemove(event: any) {
    //this.files.splice(this.files.indexOf(event), 1);
  }
  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
  }
  clearAllErrors() {
    this.showError = false;
    this.missingItems = [];
   
  }
  onSubmit() {
    if (this.files.length == 0) {
      Swal.fire('Warning', "Please select excel file to upload", 'warning');
      return;
    }
    this.loading = true;
    const formData = new FormData();
    formData.append("FolderPath", "adjustment-files");
    formData.append("File", this.files[0]);
    formData.append("FileTypeId", "1");
    this.clearAllErrors();
    this.adjustmentservice.uploadAdjustment(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      })
 
  }
  reload() {
    this.searchForm.reset();
    this.showAddNewButton=true;
    this.showOtherButton=false;
    this.showEntryScreen = false;
    this.dataList=null;
  }
  handleSuccess(data: any) {
    this.loading = false;
    if (data && data.isSuccess) {
      const responseMessages: AdjustmentUploadResult[] = data.value;
      const successData = responseMessages.find(c=> c.responseCode === '200');

      if(successData){
        this.clearForm();
        Swal.fire('Success', "Adjust uploaded successfully with " + successData.responseMessage, 'success');
        this.reload();
      }
      else{
        const serverErrorData = responseMessages.find(c=> c.responseCode === '500');
        if(serverErrorData){
          Swal.fire('Error', ErrorMsg, 'error');
          this.files = [];
        }
        else{
          this.showError = true;
          Swal.fire('Error', "Problem occured while uploading Adjust Entries, kidly review error message", 'error');
          this.missingItems = responseMessages;
     this.setSelectedTab();
        }
      }
    }
    else {
      Swal.fire('Error', ErrorMsg, 'error');
      this.files = [];
    }
  }

  handleError(error: any) {
    Swal.fire('Error', ErrorMsg, 'error');
    this.loading = false;
    this.files = [];
  }
  clearForm() {
   
    this.files = [];
    this.clearAllErrors();
  }
  setSelectedTab(){
    if(this.missingItems.length)
      this.selectedTabIndex = 0;
   
  }
  CollapsetoggleList8() {
    this.isCollapsedList8 = !this.isCollapsedList8;
  }
  ClosetoggleList8() {
    this.isClosedList8 = true
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
}

