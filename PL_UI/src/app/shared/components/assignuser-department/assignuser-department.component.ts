import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import Swal from 'sweetalert2';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: 'app-assignuser-department',
  templateUrl: './assignuser-department.component.html',
  styleUrls: ['./assignuser-department.component.scss']
})
export class AssignuserDepartmentComponent implements OnInit {

  @Input() userObjectId: any;
  @Output() totalDeparment = new EventEmitter<string>();
  userDeparmentMappingForm: FormGroup;
  loading = false;
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  newEntry = false;
  showTable: boolean = true;
  departmentList: any;
  userdepartmentMapping: any;
  roles:any;
  customerMultiSelectSettings:any;
  @ViewChild('assignDeparmentModal') assignDeparmentModal: ElementRef;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private authService: MsalService,
    private _fBuilder: FormBuilder,
    private readonly masterService: MasterserviceService,
    private modalService: NgbModal,
    private location: Location) {
   
  }

  ngOnInit(): void {
    this.loadUserDepartmentMapping();
    this.loadDepartment();
    this.initializeFormControl();
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
  initializeFormControl() {
    this.userDeparmentMappingForm = this._fBuilder.group({
      departments: [[], [RxwebValidators.required]],
      userlId: [this.userObjectId],
      existingDepartment: []
    })
    
  }
  get f() { return this.userDeparmentMappingForm.controls; }
  onBackClick($event: boolean) {
    this.location.back();
  }
  loadDepartment() {
    this.masterService.getdepartmentLookup()
    .pipe()
    .subscribe({
      next: (x) => (
        this.departmentList = x.map(el => {
          return {
            departmentId: el.departmentId,
            departmentName:el.departmentName,
            id: el.departmentId,
            itemName: el.departmentName ,
            departmentCode: el.departmentCode ,
          }
        })
      ),
      error: (x) => (console.log(x))
    });
    
  }
  loadUserDepartmentMapping() {
    this.masterService.getuserdepartmentMapping(this.userObjectId)
      .subscribe((resp) => {
        this.userdepartmentMapping = resp.map(el => {
          return {
            departmentId: el.departmentId,
            departmentName:el.departmentName,
            id: el.departmentId,
            itemName: el.departmentName ,
            departmentCode: el.departmentCode ,
            countryName: el.countryName
          }
        })
        this.totalDeparment.emit(this.userdepartmentMapping.length);
      });
  }
  onAddNewClick(event: any) {
    if (this.userdepartmentMapping.length > 0) {
      const selectDepartmentId = this.userdepartmentMapping.map(item => {
        const container = {};
        container["departmentId"] = item.departmentId;
        container["deparmentCode"] = item.departmentCode;
        container["departmentName"] = item.departmentName;
        container["id"] = item.departmentId;
        container["itemName"] = item.departmentName;
        return container;
      });
      this.userDeparmentMappingForm.patchValue({
        departments: selectDepartmentId,
        existingDepartment: selectDepartmentId
      })
    }
    this.modalService.open(this.assignDeparmentModal);
    this.newEntry = true;
  }
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onClosePopUp() {
    this.userDeparmentMappingForm.reset();
  }
  onSubmit() {
    this.submitted = true;
    if (this.userDeparmentMappingForm.invalid) {
      return;
    }
    this.loading=true;
    var deparments: any[] = [];
    var deleteDeparments: any[] = [];

    if (this.f.existingDepartment.value != null) {
      deleteDeparments = this.f.existingDepartment.value.filter((el) => {
        return !this.f.departments.value.some((f) => {
          return el === f
        });
      });

      deparments = this.f.departments.value.filter((d) => {
        return !this.f.existingDepartment.value.some((f) => {
          return d === f.departmentId
        })
      });
    }
    else {
      deparments = this.f.departments.value;
    }
    if (deparments.length == 0 && deleteDeparments.length == 0) {
      Swal.fire('Warning', "You have not assign any department to user for add or delete", 'warning');
      this.loading=false;
      return;
    }
    var command =
    {
      userId: this.f.userlId.value,
      departmentId: deparments.map(a => a.departmentId),
      deletedUserDepartmentMapping: deleteDeparments.map(a => a.departmentId)
    }
    if (deleteDeparments.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure ?',
        html: 'you have selected   <span style="font-size:12px; color:#f5334f;">' + deleteDeparments.map(a => a.departmentName).join(', ') + '</span> department to be removed !',
        showCancelButton: true,
        confirmButtonColor: '#7367f0',
        cancelButtonColor: '#f5334f',
        confirmButtonText: 'Yes',
        reverseButtons: true

      }).then((result) => {
        if (result.isConfirmed) {
          this.submitData(command);
        }
      })
    }
    else {
      this.submitData(command);
    }
  }

  submitData(command) {
    this.masterService
      .adduserdepartmentMapping(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }

  handleSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "User  department mapping successfully done", 'success');
    this.modalService.dismissAll('Close click');
    this.reload();
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.loadUserDepartmentMapping();
      this.showTable = true;
    }, 0);
    this.modalService.dismissAll('Close click');
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
}
