import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import Swal from 'sweetalert2';
import { MasterserviceService } from '../masterservice.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-country-master',
  templateUrl: './country-master.component.html',
  styleUrls: ['./country-master.component.scss']
})
export class CountryMasterComponent implements OnInit {
  @ViewChild('countryEntryPopup') countryEntryPopup: ElementRef;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  countryForm: FormGroup;
  loading = false;
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  dtOptions: DataTables.Settings = {};
  countryList:any;
  showTable: boolean = true;
  countryListData: any;
  selectedCountry: any;
  showEntryScreen: boolean = true;
  getCurrency:any;
  countryFileName="Country"+new Date().toDateString();
  constructor(private modalService: NgbModal,
    private _fBuilder: FormBuilder,
    private readonly masterService: MasterserviceService,
    ) {
      this.countryList=this.masterService.getCountryCountry();
      this.loadCurrency();
    }

  ngOnInit(): void {

    this.initializeFormControl();
   // this.loadCountryData();
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  get f() { return this.countryForm.controls; }

  initializeFormControl() {
    this.countryForm = this._fBuilder.group({
      CountryCode: ['', [RxwebValidators.required()]],
      CountryName: ['', [RxwebValidators.required()]],
      CountryShortDesc: [''],
      IsActive: [true, [RxwebValidators.required()]],
      CountryId: [0],
      CurrencyId: ['', [RxwebValidators.required()]],
    });
  }
  loadCurrency(){
    this.masterService.getCurrency()
    .pipe()
    .subscribe({
      next: (x) => (this.getCurrency = x),
      error: (x) => (console.log(x))
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.countryForm.invalid) {
      return;
    }
    var command = {
      CountryId: this.f.CountryId.value,
      CountryName: this.f.CountryName.value,
      CountryCode:this.f.CountryCode.value,
      CountryShortDesc: this.f.CountryShortDesc.value,
      CurrencyId:this.f.CurrencyId.value,
      IsActive: this.f.IsActive.value
    }
    this.loading = true;
    this.masterService.addUpdateCountry(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this,command.CountryId),
        error: this.handleError.bind(this)
      });

  }
  onEdiCountry(data) {
    this.selectedCountry = data;
    this.countryForm.patchValue({
      CountryCode: data.countryCode,
      CountryName: data.countryName,
      CountryShortDesc: data.countryShortDesc,
      IsActive: data.isActive,
      CountryId:data.countryId,
      CurrencyId:data.currencyId
    });
    this.showEntryScreen=false;
    this.modalService.open(this.countryEntryPopup);
  }
  handleSuccess(data: number) {
    this.loading = false;
    if(data==0)
    {
     Swal.fire('Success', "Country added successfully", 'success');
    }
   else{
     Swal.fire('Success', "Country updated successfully", 'success');
   }
    this.resetForm();
    this.reload()
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.countryForm.reset();
    this.modalService.dismissAll('Close click');
    this.dataGrid.instance.refresh();
  }
  resetForm()
  {
    this.countryForm.reset({ CountryId: 0, IsActive: true });
    this.submitted = false;
    this.loading=false;
  }
  openPopUp(popUpId) {
    this.modalService.open(popUpId);
  }
  onAddNewClick(event: any) {
    this.resetForm();
    if (event == true) {
      this.modalService.open(this.countryEntryPopup);
    }
  }
  onCountrySelectDelete(country){
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure ?',
      html: 'Are you sure you want to delete this record?',
      showCancelButton: true,
      confirmButtonColor: '#7367f0',
      cancelButtonColor: '#f5334f',
      confirmButtonText: 'Yes',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {

        this.masterService.countryDelete(country.countryId)
        .pipe()
        .subscribe({
          next: this.handleDeleteSuccess.bind(this),
          error: this.handleError.bind(this)
        });
      }
    })
  }
  handleDeleteSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "Country deleted successfully", 'success');
    this.reload();
  }
  customizeText(info){
    if(info.value==true)
    return 'Y'  ;
    else
    return 'N';
  }
}
