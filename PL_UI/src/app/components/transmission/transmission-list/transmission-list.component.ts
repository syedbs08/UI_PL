import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TransmissionService } from '../transmission.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from '../../masters/masterservice.service';
@Component({
  selector: 'app-transmission-list',
  templateUrl: './transmission-list.component.html',
  styleUrls: ['./transmission-list.component.scss']
})
export class TransmissionListComponent implements OnInit {
  @ViewChild('tranmissionEntryModal') tranmissionEntryModal: ElementRef;
  public isCollapsed8 = false;
  public isClosed8 = false;
  transmissionList: any;
  planTypeList: any;
  customerlist: any;
  fileName = "Transmission_List_" + new Date().toDateString();
  constructor(private modalService: NgbModal,
    private readonly transmissionService: TransmissionService,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder) {
    this.getPlanType();
    this.getCustomerList();
  }
  tranmissionForm: FormGroup;
  loading = false;
  submitted = false;
  ngOnInit(): void {
    this.loadData();
    this.initializeFormControl();

  }
  loadData() {
    this.transmissionList = this.transmissionService.getTransmissionList();
  }
  getPlanType() {
    this.transmissionService.getTransmissionPlanType()
      .subscribe({
        next: (data) => {
          this.planTypeList = data.map(el => { return { planTypeCode: el.planTypeCode, planTypeName: el.planTypeCode + '-' + el.planTypeName } });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
  getCustomerList() {
    this.masterService.getCollaboNonCollaboCustomersByUserCountryIds(true,null,null)
      .subscribe({
        next: (data) => {
          this.customerlist = data.map(el => { return { customerCode: el.customerCode, customerName: el.customerCode + '-' + el.customerName } });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
  get f() { return this.tranmissionForm.controls; }

  initializeFormControl() {
    this.tranmissionForm = this._fBuilder.group({
      CustomerCode: [, [RxwebValidators.required()]],
      PlanTypeCode: [, [RxwebValidators.required()]],
      TransmissionListId: [0],
      SalesType: ['', [RxwebValidators.required()]],
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.tranmissionForm.invalid) {
      return;
    }

    var command = {
      TransmissionListId: this.f.TransmissionListId.value,
      PlanTypeCode: this.f.PlanTypeCode.value,
      CustomerCode: this.f.CustomerCode.value,
      SalesType: this.f.SalesType.value,
    }
    this.loading = true;
    this.transmissionService.addDeleteTransmissionList(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, command.TransmissionListId),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: number) {
    this.loading = false;
    if (data == 0) {
      Swal.fire('Success', "Transmission added successfully", 'success');
    }
    this.reload();



  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;

  }

  //events
  onAddNewClick($event: boolean) {
    this.resetForm();
    if ($event) {
      this.modalService.open(this.tranmissionEntryModal, { backdrop: 'static' });
    }

  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  resetForm() {
    this.tranmissionForm.reset({ TransmissionListId: 0 });
    this.submitted = false;
    this.loading = false;

  }
  onClosePopUp() {
    this.resetForm();
    this.modalService.dismissAll('Close click');

  }
  reload() {
    this.loadData();
    this.tranmissionForm.reset();
    this.modalService.dismissAll('Close click');
  }


  //delete
  onDeleteTrnamission(tranmission) {
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
        var command = {
          TransmissionListId: tranmission.transmissionListId,
          PlanTypeCode: "0",
          CustomerCode: "0",
          SalesType:"0",
        }
        this.transmissionService.addDeleteTransmissionList(command)
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
    Swal.fire('Success', "Transmission list deleted successfully", 'success');
    this.reload();
  }


}
