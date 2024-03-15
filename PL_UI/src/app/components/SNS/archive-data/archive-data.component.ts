import { Component, OnInit } from '@angular/core';
import { FormArray,FormBuilder, FormGroup } from '@angular/forms';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import {SnsService} from '../sns.service';
import { CurrentMonthName} from 'src/app/shared/helpers/constants';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-archive-data',
  templateUrl: './archive-data.component.html',
  styleUrls: ['./archive-data.component.scss']
})
export class ArchiveDataComponent implements OnInit {

  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;
  public isCollapsedUpdate8 = false;
  public isClosedUpdate8 = false;
  loading: boolean = false;
  showTable: boolean = false;
  dataList:any;
  getarchiveType = [
    { archiveid: "BP", archivename: 'BP' },
    { archiveid: "Direct & SNS", archivename: 'Direct & SNS' },
  ];
  getArchivalType:any;
  submitted = false;
  formBuilder: any;
  archiveMonth:any;
  constructor( private readonly masterService: MasterserviceService,
    private readonly snsService:SnsService,
    private _fBuilder: FormBuilder) { 
     
  }
  archiveForm: FormGroup;
  ngOnInit(): void {
    this.initializeFormControl();
  }
  get f() { return this.archiveForm.controls; }
  initializeFormControl()
  {
    this.archiveForm =this._fBuilder.group({
      ArchiveType: [, [RxwebValidators.required()]],
      Month:[,[RxwebValidators.required()]],
    });
  }
  loadCurrentMonth(type:string)
  {
    if(type=="Direct & SNS")
    {
      type="Current_Month";
    }
   this.masterService.getGlobalConfigByKey(type)
   .pipe()
   .subscribe({
     next: this.handledata.bind(this),
     error: this.handleError.bind(this)
   });
  }
  handledata(data) {
    this.archiveMonth=data;
    this.archiveForm.patchValue({
      Month: data})
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  CollapsetoggleList8() {
    this.isCollapsedList8 = !this.isCollapsedList8;
  }
  clearForm(){
    this.archiveForm.patchValue(
      {
        ArchiveType:[],
        Month:[]
      }
    );
  }
  onSubmit()
  {
    this.loading=true;
    this.submitted = true;
    if (this.archiveForm.invalid) {
      return;
    }
    // var command = {
    //   Month: this.f.Month.value,
    //   Type:this.f.ArchiveType.value
    // }
    this.snsService.archive(this.f.Month.value,this.f.ArchiveType.value)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this,this.f.Month.value),
        error: this.handleError.bind(this)
      });
  }
  
  handleSuccess(month,data) {
    //   var command = {
    //   Month: month,
    //   DirectSaleIds:data.value[0].id,
    //   SNSIds:data.value[1].id
    // }
     Swal.fire('Success', "Archive data successfully", 'success');
    //  this.dataList = this.snsService.archivedata(command);
    //  this.showTable=true;
     this.loading = false;
     this.clearForm();

  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
}
