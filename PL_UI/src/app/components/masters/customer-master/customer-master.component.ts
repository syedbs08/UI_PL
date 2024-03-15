import { Component, ElementRef, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from '../masterservice.service';
import { DxDataGridModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { number } from 'echarts';

@Component({
  selector: 'app-customer-master',
  templateUrl: './customer-master.component.html',
  styleUrls: ['./customer-master.component.scss']
})

export class CustomerMasterComponent implements OnInit {
  showTable: boolean = true;
  public isCollapsed8 = false;
  public isClosed8 = false;
  showEntryScreen: boolean = false;
  customerList: any;
  getRegion: any;
  getCountry: any;
  getSalesOffice: any;
  getDepartment: any;
  getPersonInCharge: any;
  getAccount: any;
  getSaleType: any;
  showExportButton: boolean = false;
  showAddNewButton: boolean = true;
  showOtherButton: boolean = false;
  isDisable: boolean = false;
  getSalesOrganization: any;
  getCurrency:any;
  constructor(private modalService: NgbModal,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder
  ) {
    this.loadData();
    this.loadDepartment();
    this.loadRegion();
    this.loadSalesOffice();
    this.loadSaleType();
    this.loadSalesOrganization();
    this.loadCurrency();
  }

  loadData() {
    this.customerList = this.masterService.getCustomerList("customerId");
  }
  validateEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    return emailRegex.test(email);
  }
  validateNumberString(event: any) {
    const inputChar = String.fromCharCode(event.which);
    if (!/^[0-9]*$/.test(inputChar)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  customerForm: FormGroup;
  loading = false;
  submitted = false;
  excelLoading = false;
  ngOnInit(): void {
    this.initializeFormControl();
  }
  get f() { return this.customerForm.controls; }

  initializeFormControl() {
    this.customerForm = this._fBuilder.group({
      CustomerCode: [null, [Validators.required, RxwebValidators.maxLength({ value: 10 })]],
      CustomerName: ['', [RxwebValidators.required()]],
      EmailId: ['', [RxwebValidators.required(), RxwebValidators.email()]],
      CustomerShortName: ['', [RxwebValidators.required()]],
      SalesOfficeId: [],
      RegionId: [],
      CountryId: ['', [RxwebValidators.required()]],
      DepartmentId: ['', [RxwebValidators.required()]],
      PersonInChargeId: [],
      IsPSI: [],
      IsBP: [],
      IsActive: [true, [RxwebValidators.required()]],
      CustomerId: [0],
      SalesTypeIds: [true, [RxwebValidators.required()]],
      AccountId: [],

      IsCollabo: [],
      SalesOrganizationCode: [],
      CurrencyCode:[true, [RxwebValidators.required()]]
    });
  }

  customizeText(info) {
    if (info.value == true)
      return 'Y';
    else
      return 'N';
  }
  onCountrySelect(id: number, salesTypeIds: [number]) {
    this.customerForm.patchValue({
      PersonInChargeId: null,
    });
    this.loadPIC(id);
  }
  setSaleTypeConditionValidators(saleTypeIds: [number]) {
    if (saleTypeIds.includes(2)) {
      this.customerForm.controls["AccountId"].setValidators([RxwebValidators.required()]);
    }
    else {
      this.customerForm.controls["AccountId"].clearValidators();
    }
    this.customerForm.controls['AccountId'].updateValueAndValidity();
  }
  onSaleTypeSelect(saleTypeIds: [number]) {

    if (saleTypeIds.includes(2)) {
      this.loadAccount();
    } else {
      this.customerForm.patchValue({
        PersonInChargeId: null,
        AccountId: null,
      });
      this.getAccount = null;

    }
    this.setSaleTypeConditionValidators(saleTypeIds);
  }
  loadSalesOrganization() {
    this.masterService.getSalesOrganization()
      .pipe()
      .subscribe({
        next: (x) => (this.getSalesOrganization = x),
        error: (x) => (console.log(x))
      });
  }
  
  loadCurrency() {
    this.masterService.getCurrency()
      .pipe()
      .subscribe({
        next: (x) => (this.getCurrency = x),
        error: (x) => (console.log(x))
      });
  }
  loadPIC(countryId) {
    this.masterService.getAllUsersByCountryId(countryId)
      .pipe()
      .subscribe({
        next: (x) => (this.getPersonInCharge = x),
        error: (x) => (console.log(x))
      });
  }

  loadAccount() {
    this.masterService.getAccounts()
      .subscribe({
        next: (data) => {
          this.getAccount = data;
          this.getAccount.forEach((item) => {
            item.displayName = `${item.accountCode}-${item.accountName}`;
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
  loadSaleType() {
    this.masterService.getSaleTypes()
      .pipe()
      .subscribe({
        next: (x) => (this.getSaleType = x),
        error: (x) => (console.log(x))
      });
  }
  loadRegion() {
    this.masterService.getRegions().subscribe(s => {
      this.getRegion = s.map(m => { return { regionName: m.regionCode + "-" + m.regionName, regionId: m.regionId } })
    });

  }
  onDepartmentSelect(departmentId: any) {
    this.customerForm.patchValue({
      PersonInChargeId: null,
      CountryId: null,
    });
    this.masterService.countryLookupByDepartment(departmentId).pipe()
      .subscribe(s => {
        this.getCountry = s.map(el => { return { countryName: el.countryCode + "-" + el.countryName, countryId: el.countryId } });
      });
  }
  loadDepartment() {

    this.masterService.getdepartmentLookup().pipe()
      .subscribe(s => {
        this.getDepartment = s.map(el => { return { departmentName: el.departmentCode + "-" + el.departmentName, departmentId: el.departmentId } });
      });
  }
  loadSalesOffice() {
    this.masterService.getSalesOffices().pipe()
      .subscribe(s => {
        this.getSalesOffice = s.map(el => { return { salesOfficeName: el.salesOfficeCode + "-" + el.salesOfficeName, salesOfficeId: el.salesOfficeId } });
      });
  }
  onSubmit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    var command = {
      CustomerId: this.f.CustomerId.value,
      CustomerCode: this.f.CustomerCode.value,
      CustomerName: this.f.CustomerName.value,
      CustomerShortName: this.f.CustomerShortName.value,
      EmailId: this.f.EmailId.value,
      SalesOfficeId: this.f.SalesOfficeId.value,
      RegionId: this.f.RegionId.value,
      CountryId: this.f.CountryId.value,
      DepartmentId: this.f.DepartmentId.value,
      PersonInChargeId: this.f.PersonInChargeId.value,
      IsActive: this.f.IsActive.value,
      IsPSI: this.f.IsPSI.value,
      IsBP: this.f.IsBP.value,
      SalesTypeIds: this.f.SalesTypeIds.value,
      AccountId: this.f.AccountId.value,
      SalesOrganizationCode: this.f.SalesOrganizationCode.value,
      IsCollabo: this.f.IsCollabo.value,
      CurrencyCode:this.f.CurrencyCode.value,
    }
    this.loading = true;
    this.masterService.addUpdateCustomer(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, command.CustomerId),
        error: this.handleError.bind(this)
      });
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  handleSuccess(data: number) {
    this.loading = false;
    if (data == 0) {
      Swal.fire('Success', "Customer added successfully", 'success');
    }
    else {
      Swal.fire('Success', "Customer updated successfully", 'success');
    }
    this.reload();
    this.loadData();
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.customerForm.reset({ CustomerId: 0, IsActive: true });
    this.showEntryScreen = false;
    this.showExportButton = false;
    this.showAddNewButton = true;
    this.showOtherButton = false;
    this.getAccount = null;
  }
  backButton() {
    this.reload();
  }
  resetForm() {
    this.customerForm.reset({ CustomerId: 0, IsActive: true });
    this.submitted = false;
    this.loading = false;
    this.showEntryScreen = false;
    this.showTable = true;
  }
  onAddNewClick($event: boolean) {
    this.isDisable = false;
    this.customerForm.reset({ CustomerId: 0, IsActive: true });
    this.showEntryScreen = true;
    this.submitted = false;
    this.showExportButton = false;
    this.showAddNewButton = false;
    this.showOtherButton = true;
    this.getAccount = null;
    this.getPersonInCharge = null;
  }
  onCustomerSelect(customer) {
    this.isDisable = true;
    this.onDepartmentSelect(customer.departmentId);
    this.onCountrySelect(customer.countryId, customer.salesTypeIds);
   
    this.customerForm.patchValue({
      CustomerId: customer.customerId,
      CustomerCode: customer.customerCode,
      CustomerName: customer.customerName,
      CustomerShortName: customer.customerShortName,
      EmailId: customer.emailId,
      SalesOfficeId: customer.salesOfficeId,
      RegionId: customer.regionId,
      CountryId: customer.countryId,
      DepartmentId: customer.departmentId,
      PersonInChargeId: customer.personInChargeId,
      IsActive: customer.isActive,
      IsPSI: customer.isPSI,
      IsBP: customer.isBP,
      SalesTypeIds: customer.salesTypeIds == null ? null : customer.salesTypeIds.split(',').map(Number).filter((value, index, self) => self.indexOf(value) === index),
      AccountId: customer.accountId,
      SalesOrganizationCode: customer.salesOrganizationCode,
      IsCollabo: customer.isCollabo,
      CurrencyCode:customer.currencyCode
    })
    this.showEntryScreen = true;
    this.showExportButton = false;
    this.showAddNewButton = false;
    this.showOtherButton = true;
    this.onSaleTypeSelect(customer.salesTypeIds);

  }

  onExportClick($event) {
    this.excelLoading = true;
    this.masterService.downloadExcels("export-customer", "customers")
      .subscribe((result: any) => {
        var blob = new Blob([result]);
        let saveAs = require('file-saver');
        saveAs(blob, "customermaster" + new Date().toTimeString() + ".xlsx");
        this.excelLoading = false;

      });
  }
}
