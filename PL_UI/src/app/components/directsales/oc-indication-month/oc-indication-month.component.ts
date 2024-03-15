import { Component, ElementRef, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectsalesService } from '../directsales.service';
import { ProductcategoryService } from 'src/app/components/masters/productcategory-master/productcategory.service';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import themes from 'devextreme/ui/themes';
import Swal from 'sweetalert2';
import { MsalService } from '@azure/msal-angular';
import { DxDataGridComponent } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { UserblockService } from 'src/app/shared/services/userblock.service';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parse, addMonths, format } from 'date-fns';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
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
  selector: 'app-oc-indication-month',
  templateUrl: './oc-indication-month.component.html',
  styleUrls: ['./oc-indication-month.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OcIndicationMonthComponent implements OnInit {
  @ViewChild(UserlockComponent, { static: false }) lock: UserlockComponent;
  selectedAttachment: any;
  checkBlock: any;
  attachmentList: any;
  selectedItemKeys: any[] = [];
  multipleItems = [];
  multipleSettings = {};
  showTable: boolean = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;
  public isCollapsedUpdate8 = false;
  public isClosedUpdate8 = false;
  showMarketingTeam: boolean = false;
  showSalesTeam: boolean = false;
  downloadloading = false;
  showUpdate = false;
  getCompany: any;
  getCountry: any;
  getCustomer: any;
  getMG1: any;
  getMG2: any;
  dataList: any;
  allMode: string;
  checkBoxesMode: string;
  files: File[] = [];
  rejectedFile: File[] = [];
  customerMultiSelectSettings = {};
  productCategoryId1MultiSelectSettings = {};
  productCategoryId2MultiSelectSettings = {};
  fromMonth = new FormControl();
  toMonth = new FormControl();
  fileName = "OCIndicationMonthConfirm_" + new Date().toDateString();
  roles: any;
  isLoading = false;
  indicationMonthYear: any;
  lockMonthYear: any;
  currentMonthYear: any;
  changes: [];
  getMonthType: any;
  @ViewChild('attachmentModal') attachmentModal: ElementRef;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  constructor(
    private userBlockService: UserblockService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: MsalService,
    private readonly directsalesService: DirectsalesService,
    private readonly productcategoryService: ProductcategoryService,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder) {
    this.masterService.getGlobalConfigByKey("Lock_Month").subscribe(x => {
      this.fromMonth = new FormControl(this.addOneMonth(x, 1));
      this.toMonth = new FormControl(this.addOneMonth(x, 1));
      this.lockMonthYear = x;
      this.currentMonthYear = this.addOneMonth(x, -1);
      this.indicationMonthYear = this.addOneMonth(x, 1);
      this.getMonthType = [
        { id: 'Current_Month', name: 'Current Month(' + this.currentMonthYear + ')' },
        { id: 'Lock_Month', name: 'Lock Month(' + this.lockMonthYear + ')' },
        { id: 'Indication_Month', name: 'Indication Month(' + this.indicationMonthYear + ')' },

      ];
    })
    this.loadCompany();
    this.loadCountry();
    this.loadMG1();
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  customizeText(info) {
    if (info.value == true)
      return 'Y';
    else
      return 'N';
  }
  onRowPrepared(e) {
    if (e.rowType === "data") {
      if (e.data.reason === "Agent Signed") {
        e.rowElement.style.backgroundColor = '#E6F2FD';
      }
      else if (e.data.reason === "Email Confirmation") {
        e.rowElement.style.backgroundColor = '#B3D9FA';
      }
      if (e.data.ocIndicationMonthStatus === "Confirmed") {
        const checkBoxElement = e.rowElement.querySelector('.dx-widget dx-checkbox dx-select-checkbox dx-datagrid-checkbox-size');
        if (checkBoxElement) {

          checkBoxElement.style.display = 'none';

        }
        // e.component.columnOption('selection', 'disabled', true);
        // e.rowElement.classList.add('dx-selection-disabled');
      }
    }
  }
  loading = false;
  updateloading = false;
  deleteloading = false;
  confirmloading = false;
  submitted = false;
  searchForm: FormGroup;
  entryForm: FormGroup;
  ngOnInit(): void {
    this.initializeFormControl();
    this.initializeeEntryFormControl();


    this.roles = this.authService.instance.getActiveAccount()?.idTokenClaims?.roles!;
    this.multipleSettings = {
      singleSelection: false,
      text: "Select Multiple Months",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class"
    };
  }
  get f() { return this.searchForm.controls; }
  get entryf() { return this.entryForm.controls; }
  initializeeEntryFormControl() {
    this.entryForm = this._fBuilder.group({
      Reason: [],
      IsSNS: [false],
      IsPO: [false],
      TermId: [],
      Remarks: [],
    })
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
    this.searchForm = this._fBuilder.group({
      CompanyId: [],
      CustomerType: [],
      CustomerId: [],
      ProductCategoryId1: [],
      ProductCategoryId2: [],
      MonthTypeId: [, [RxwebValidators.required()]],

    });

    this.productCategoryId1MultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Product Sub-Category",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit: 1
    };

    this.productCategoryId2MultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Product Type",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit: 1
    };

    this.customerMultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Select Customers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit: 1
    };

  }
  addOneMonth(yyyymm: string, addmonth: any): string {
    // Parse the input string into a Date object
    const date = parse(yyyymm, 'yyyyMM', new Date());

    // Add one month to the Date object
    const modifiedDate = addMonths(date, addmonth);

    // Format the modified Date object as a 'yyyymm' string
    const modifiedYyyyMm = format(modifiedDate, 'yyyyMM');

    // Return the modified 'yyyymm' string
    return modifiedYyyyMm;
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.f.MonthYear.value!;
    ctrlValue.year(normalizedYear.year());
    this.f.MonthYea.setValue(ctrlValue);
  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.f.MonthYea.value!;
    ctrlValue.month(normalizedMonth.month());
    this.f.MonthYea.setValue(ctrlValue);
    datepicker.close();
  }
  onAttachmentClick(data: any) {
    this.masterService.downloadFile(data.item.ocIndicationMonthAttachmentIdBlobFile, "ocindicationmonth")
      .subscribe((result: any) => {
        var blob = new Blob([result]);
        let saveAs = require('file-saver');
        saveAs(blob, data.item.ocIndicationMonthAttachmentIdFile);
      });
  }
  selectionChanged(data: any) {
    let formValue = this.searchForm.getRawValue();
    this.selectedItemKeys = data.selectedRowKeys;
    const selectedRows = data.selectedRowsData;
    for (let i = 0; i < selectedRows.length; i++) {
      this.selectedAttachment = selectedRows[i].attachements;
    }
    if (this.f.MonthTypeId.value == "Indication_Month") {
      if (this.selectedItemKeys.length == 0) {
        this.showUpdate = false;
        this.entryForm.reset();
      }
      else {
        if (this.roles.includes('OPSI_MKTG_HEAD')) {
          if (this.f.MonthTypeId.value == "Indication_Month") {
            this.showMarketingTeam = true;
            this.showSalesTeam = false;
            this.showUpdate = true;
          }
        }
        else
          if (this.roles.includes('OPSI_SALES_HEAD')) {
            if (this.f.MonthTypeId.value == "Indication_Month") {
              this.showSalesTeam = true;
              this.showMarketingTeam = false;
              this.showUpdate = true;
            }
          }
      }
    }
  }

  onFilesRejected(event) {
    console.log(event);
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
  }
  getCustomerType = [
    { id: true, name: 'Collabo' },
    { id: false, name: 'Non-Collabo' },

  ];


  getReason = [
    { id: 'Email Confirmation', name: 'Email Confirmation' },
    { id: 'Agent Signed', name: 'Agent Signed' },

  ];
  getTermId = [
    { id: 0, name: '0' },
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
  ];
  loaddata(command) {
    this.dataList = this.directsalesService.getOCIndicationMonth(command);
    if (this.dataList && this.dataList.loadOptions && this.dataList.loadOptions.data) {
      // data property is not null
      this.Collapsetoggle8();
    }
  }
  loadCompany() {
    this.masterService.getCompanies()
      .pipe()
      .subscribe({
        next: (x) => (this.getCompany = x),
        error: (x) => (console.log(x))
      });
  }
  loadCustomer(customerType: boolean) {
    this.masterService.getCollaboNonCollaboCustomersByUserCountryIds(customerType, null, "Direct")
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
  loadCountry() {
    this.masterService.userCountryLookup()
      .pipe()
      .subscribe({
        next: (x) => (
          this.getCountry = x.map(el => { return { countryName: el.countryCode + "-" + el.countryName, countryId: el.countryId } })
        ),
        error: (x) => (console.log(x))
      });
  }
  loadMG1() {
    this.productcategoryService.getUserMgs(2).subscribe(x => {
      this.getMG1 = x;

      this.getMG1 = this.getMG1.map((item) => {
        return {
          displayName: `${item.productCategoryCode}-${item.name}`,
          id: item.id,
          itemName: `${item.productCategoryCode}-${item.name}`,
          productCategoryCode: item.productCategoryCode
        }
      });

    });
    this.getMG2 = null;
  }
  loadMg2(mg1Id: number) {
    this.productcategoryService.getUserMgs(3).subscribe(x => {
      this.getMG2 = x.filter(x => x.parentId.split(',').map(Number).includes(mg1Id));
    });
    this.getMG2.forEach((item) => {
      item.displayName = `${item.productCategoryCode}-${item.name}`;
    });
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
  CollapsetoggleUpdate8() {
    this.isCollapsedUpdate8 = !this.isCollapsedUpdate8;
  }
  ClosetoggleUpdate8() {
    this.isClosedUpdate8 = true
  }
  reload() {
   
    this.dataGrid.instance.clearSelection();
    this.entryForm.reset();
    this.onSearch();
    this.modalService.dismissAll('Close click');
  }
  resetForm() {
    this.submitted = false;
    this.loading = false;
    this.updateloading = false;
    this.deleteloading = false;
    this.confirmloading = false;
    this.showTable = true;
  }
  onUpdate() {
    this.submitted = true;
    this.updateloading = true;
    if (this.selectedItemKeys.length == 0) {
      Swal.fire('Error', "Please select one record", 'error');
      this.updateloading = false;
      return;
    }
    const formData = new FormData();
    if (this.roles.includes('OPSI_SALES_HEAD')) {
      if (this.entryf.Reason.value == null) {
        Swal.fire('Error', "Please select reason", 'error');
        this.updateloading = false;
        return;
      }
    }

    if (this.files.length > 0) {
      formData.append("FolderPath", "ocindicationmonth");
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i]);
      }
    }
    formData.append("CustomerId", this.selectedItemKeys.map(x => x.customerId).toString());
    formData.append("MaterialCode", this.selectedItemKeys.map(x => x.materialCode).toString());
    formData.append("SalesEntryId", this.selectedItemKeys.map(x => x.salesEntryId).toString());
    formData.append("Reason", this.entryf.Reason.value == null ? "" : this.entryf.Reason.value);
    formData.append("IsSNS", this.entryf.IsSNS.value);
    formData.append("TermId", this.entryf.TermId.value);
    formData.append("IsPO", this.entryf.IsPO.value);
    formData.append("Status", "Update");
    formData.append("Remarks", this.entryf.Remarks.value == null ? "" : this.entryf.Remarks.value);
    this.directsalesService.updateOCIndicationMonth(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, "OC Indication month updated successfully"),
        error: this.handleError.bind(this)
      });

    
  }
  handleSuccess(msg: any) {
    Swal.fire('Success', msg, 'success');
    this.loading = false;
    this.updateloading = false;
    this.deleteloading = false;
    this.confirmloading = false;
    this.reload();
    
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
    this.updateloading = false;
    this.deleteloading = false;
    this.confirmloading = false;
  }
  onDelete() {
    this.deleteloading = true;
    this.submitted = true;
    if (this.selectedItemKeys.length == 0) {
      Swal.fire('Error', "Please select one record", 'error');
      this.deleteloading = false;
      return;
    }
    const formData = new FormData();
    formData.append("CustomerId", this.selectedItemKeys.map(x => x.customerId).toString());
    formData.append("MaterialCode", this.selectedItemKeys.map(x => x.materialCode).toString());
    formData.append("SalesEntryId", this.selectedItemKeys.map(x => x.salesEntryId).toString());
    formData.append("Reason", this.entryf.Reason.value);
    formData.append("IsSNS", this.entryf.IsSNS.value);
    formData.append("TermId", this.entryf.TermId.value);
    formData.append("IsPO", this.entryf.IsPO.value);
    formData.append("Status", "Delete");
    formData.append("Remarks", this.entryf.Remarks.value);
    this.directsalesService.updateOCIndicationMonth(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, "Updated Status successfully"),
        error: this.handleError.bind(this)
      });
   
  }
  onDownload() {
    this.submitted = true;
    this.modalService.open(this.attachmentModal, { backdrop: 'static' });
  }
  onConfirm() {
    this.confirmloading = true;
    this.submitted = true;
    if (this.selectedItemKeys.length == 0) {
      Swal.fire('Error', "Please select one record", 'error');
      this.confirmloading = false;
      return;
    }

    if (this.roles.includes('OPSI_MKTG_HEAD')) {
      if (this.selectedItemKeys.map(x => x.reason).toString() == "") {
        Swal.fire('Error', "You can't confirm this record without reason", 'error');
        this.confirmloading = false;
        return;
      }
    }
    const formData = new FormData();
    formData.append("CustomerId", this.selectedItemKeys.map(x => x.customerId).toString());
    formData.append("MaterialCode", this.selectedItemKeys.map(x => x.materialCode).toString());
    formData.append("SalesEntryId", this.selectedItemKeys.map(x => x.salesEntryId).toString());
    formData.append("Reason", this.entryf.Reason.value);
    formData.append("IsSNS", this.entryf.IsSNS.value);
    formData.append("TermId", this.entryf.TermId.value);
    formData.append("IsPO", this.entryf.IsPO.value);
    formData.append("Status", "Confirm");
    formData.append("Remarks", this.entryf.Remarks.value == null ? "" : this.entryf.Remarks.value);
    this.directsalesService.updateOCIndicationMonth(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, "OC Indication month confirmed successfully"),
        error: this.handleError.bind(this)
      });
    
  }
  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.loading = true;
    this.submitted = true;
    let formValue = this.searchForm.getRawValue();
    var selectedCustomerIdList = formValue.CustomerId ? formValue.CustomerId.map(c => { return c.customerId }) : [];
    var selectedProductCategoryId1List = formValue.ProductCategoryId1 ? formValue.ProductCategoryId1.map(c => { return c.id }) : [];
    var selectedProductCategoryId2List = formValue.ProductCategoryId2 ? formValue.ProductCategoryId2.map(c => { return c.id }) : [];
    if (this.f.MonthTypeId.value == "Indication_Month") {
      this.fromMonth = this.indicationMonthYear;
      this.toMonth = this.indicationMonthYear;
    } else if (this.f.MonthTypeId.value == "Current_Month") {
      this.fromMonth = this.currentMonthYear;
      this.toMonth = this.currentMonthYear;
    }
    else if (this.f.MonthTypeId.value == "Lock_Month") {
      this.fromMonth = this.lockMonthYear;
      this.toMonth = this.lockMonthYear;
    } else {
      Swal.fire('Error', "Please select one month Type", 'error');
      return;
    }
    var command = {
      CountryId: "",
      CustomerId: selectedCustomerIdList ? (selectedCustomerIdList.length > 0 ? selectedCustomerIdList : []) : [],
      CustomerTypeId: this.f.CustomerType.value == null ? "" : this.f.CustomerType.value,
      ProductCategoryId: selectedProductCategoryId1List ? (selectedProductCategoryId1List.length > 0 ? selectedProductCategoryId1List : []) : [],
      ProductSubCategoryId: selectedProductCategoryId2List ? (selectedProductCategoryId2List.length > 0 ? selectedProductCategoryId2List : []) : [],
      StartMonthYear: this.fromMonth,
    }
    this.showTable = true;
    this.loaddata(command);
    this.loading = false;
    this.files = [];

  }
}
