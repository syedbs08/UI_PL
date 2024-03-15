import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { de } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { MasterserviceService } from '../masterservice.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  @ViewChild('departmentEntryPopup') departmentEntryPopup: ElementRef;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  departmentForm: FormGroup;
  loading = false;
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  dtOptions: DataTables.Settings = {};
  departmentList:any;
  showTable: boolean = true;
  deparmentSelect:any;
  showEntryScreen: boolean = true;
  CountryList :any;
  departmentFileName="Department_"+new Date().toDateString();
  departentListData:any;
  getCompany:any;
  countryLabel:any;
  constructor(private modalService: NgbModal,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder,) {
      this.bindDepartmentGrid();
     }

  ngOnInit(): void {
    this.initializeFormControl();
    this.bindCountryList();
    this.masterService.getCompanies().subscribe(s =>{
      this.getCompany=s.map(m =>{return {companyName:m.companyName,companyId:m.companyId}})
    });
  }
bindDepartmentGrid()
{
  this.departmentList=this.masterService.getDepartmentList();

}
  get f() { return this.departmentForm.controls; }

  initializeFormControl() {
    this.departmentForm = this._fBuilder.group({
      CompanyId: [''],
      DepartmentCode: ['', [RxwebValidators.required()]],
      DepartmentName: ['', [RxwebValidators.required()]],
      DepartmentDescription: [''],
      CountryId: ['', [RxwebValidators.required()]],
      IsActive: [true],
      DepartmentId:[0]
    });
  }
mapDeparmentCompanies(dept)
{
 return dept.countries.map( el => el.countryCode +"-"+ el.countryName );

}
Collapsetoggle8() {
  this.isCollapsed8 = !this.isCollapsed8;
}
Closetoggle8() {
  this.isClosed8 = true
}
  bindCountryList()
  {
    this.masterService.countryLookup().pipe()
    .subscribe(s =>{
      this.CountryList=s.map(el => {return {countryName: el.countryCode +"-"+ el.countryName,countryId:el.countryId}});
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.departmentForm.invalid || this.f.CountryId.value.length==0) {
      return;
    }
    var command = {
      CompanyId:String(this.f.CompanyId.value),
      DepartmentId:  this.f.DepartmentId.value,
      DepartmentCode:this.f.DepartmentCode.value,
      DepartmentName: this.f.DepartmentName.value,
      DepartmentDescription: this.f.DepartmentDescription.value,
      CountryId:this.f.CountryId.value.join(","),
      IsActive: this.f.IsActive.value
    }
    this.loading = true;
    if(command.DepartmentId==null)
    {
      command.DepartmentId=0;
    }
    this.masterService.addDepartment(command)
    .pipe()
    .subscribe({
      next:this.handleSuccess.bind(this,command.DepartmentId),
      error:this.handleError.bind(this)
    })
  }
  onEdiDepartment(data) {
    this.countryLabel='Mapped Countries'
    this.deparmentSelect = data;
    this.departmentForm.patchValue({
      CompanyId:data.companyId,
      DepartmentCode: data.departmentCode,
      DepartmentName: data.departmentName,
      DepartmentDescription: data.departmentDescription,
      IsActive: data.isActive,
      CountryId:data.countries.map(x =>x.countryId),
      DepartmentId:data.departmentId
    });
    this.showEntryScreen=false;
    this.modalService.open(this.departmentEntryPopup, {  backdrop: 'static' });
  }
  handleSuccess(data: number) {
    this.loading = false;
    if(data==0)
    {
     Swal.fire('Success', "Department added successfully", 'success');
    }
   else{
     Swal.fire('Success', "Department updated successfully", 'success');
   }
    this.resetForm();
    this.reload();
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  resetForm()
  {
    this.departmentForm.reset({ DepartmentId:0,CountryId: 0, IsActive: true });
    this.submitted = false;
    this.loading=false;
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.departmentForm.reset();
    this.modalService.dismissAll('Close click');
    this.dataGrid.instance.refresh();
  }
  openPopUp(popUpId) {
    this.modalService.open(popUpId, {  backdrop: 'static' });
  }
  onAddNewClick(event: any) {
  this.countryLabel='Map Countries'
    this.resetForm();
    if (event == true) {
      this.modalService.open(this.departmentEntryPopup, {  backdrop: 'static' });
    }
  }
  onDepartmentSelectDelete(dept){

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
        this.masterService.deparmentDelete(dept.departmentId)
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
    Swal.fire('Success', "Department deleted successfully", 'success');
    this.reload();
  }
  customizeText(info){
    if(info.value==true)
    return 'Y'  ;
    else
    return 'N';
  }
}
