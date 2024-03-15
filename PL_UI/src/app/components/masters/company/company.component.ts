import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from '../masterservice.service';
import { DxDataGridModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']

})
export class CompanyComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public isCollapsed8 = false;
  public isClosed8 = false;
  companyList: any;
  showTable: boolean = true;
  selectedCompany: any;
  @ViewChild('companyEntryModal') companyEntryModal: ElementRef;
  constructor(private modalService: NgbModal,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder) {


  }
  companyForm: FormGroup;
  loading = false;
  submitted = false;
  excelLoading = false;
  ngOnInit(): void {
    this.loadData();
    this.initializeFormControl();
  }
  loadData() {
    this.companyList = this.masterService.getComapnyList();
  }

  get f() { return this.companyForm.controls; }

  initializeFormControl() {
    this.companyForm = this._fBuilder.group({
      CompanyCode: [null, [RxwebValidators.required(),RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber ,allowDecimal:false }),
        RxwebValidators.maxLength({value:4 }), RxwebValidators.minLength({value:4 })]],
      CompanyName: ['', [RxwebValidators.required()]],
      IsActive: [true, [RxwebValidators.required()]],
      CompanyId: [0]
    });
  }
  customizeText(info) {
    if (info.value == true)
      return 'Y';
    else
      return 'N';
  }
  onSubmit() {
    this.submitted = true;
    if (this.companyForm.invalid) {
      return;
    }

    var command = {
      CompanyId: this.f.CompanyId.value,
      CompanyName: this.f.CompanyName.value,
      CompanyCode: this.f.CompanyCode.value,
      IsActive: this.f.IsActive.value
    }
    this.loading = true;
    this.masterService.addUpdateCompany(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, command.CompanyId),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: number) {
    this.loading = false;
    if (data == 0) {
      Swal.fire('Success', "Company added successfully", 'success');
    }
    else {
      Swal.fire('Success', "Company updated successfully", 'success');
    }
    this.reload();



  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;

  }
  onExportClick($event) {
    this.excelLoading = true;
    this.masterService.downloadExcels("export-company", "companies")
      .subscribe((result: any) => {
        var blob = new Blob([result]);
        let saveAs = require('file-saver');
        saveAs(blob, "companymaster" + new Date().toTimeString() + ".xlsx");
        this.excelLoading = false;

      });
  }
  //events
  onAddNewClick($event: boolean) {
    this.resetForm();
    if ($event) {
      this.modalService.open(this.companyEntryModal, { backdrop: 'static' });
    }

  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  resetForm() {
    this.companyForm.reset({ CompanyId: 0, IsActive: true });
    this.submitted = false;
    this.loading = false;

  }
  onClosePopUp() {
    this.resetForm();
    this.modalService.dismissAll('Close click');

  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.loadData();
    this.companyForm.reset();
    this.modalService.dismissAll('Close click');
  }
  onEditCompany(data) {
    this.selectedCompany = data;
    this.companyForm.patchValue({
      CompanyId: data.companyId,
      CompanyName: data.companyName,
      CompanyCode: data.companyCode,
      IsActive: data.isActive
    });

    this.modalService.open(this.companyEntryModal);
  }

  //delete
  onDeleteCompnay(company) {
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

        this.masterService.companyDelete(company.companyId)
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
    Swal.fire('Success', "Company deleted successfully", 'success');
    this.reload();
  }


}
