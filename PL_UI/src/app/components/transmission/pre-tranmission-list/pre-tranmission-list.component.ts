import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import themes from 'devextreme/ui/themes';
import Swal from 'sweetalert2';
import { TransmissionService } from '../transmission.service';
import {RxwebValidators } from '@rxweb/reactive-form-validators';
import { ResultMonthName} from 'src/app/shared/helpers/constants';
import { parse, addMonths, format } from 'date-fns';
import { MasterserviceService } from '../../masters/masterservice.service';
@Component({
  selector: 'app-pre-tranmission-list',
  templateUrl: './pre-tranmission-list.component.html',
  styleUrls: ['./pre-tranmission-list.component.scss']
})
export class PreTranmissionListComponent implements OnInit {
  public isCollapsed8 = false;
  public isClosed8 = false;
  loading = false;
  dataList: any;
  allMode: string;
  checkBoxesMode: string;
  selectedItemKeys: any[] = [];
  selectedCustomerICode: any;
  
  constructor(    private readonly transmissionService: TransmissionService,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
   
    
  }
  entryForm: FormGroup;
 
 
  submitted = false;
  ngOnInit(): void {
    this.initializeeEntryFormControl();
    this.masterService.getGlobalConfigByKey(ResultMonthName).subscribe(x => {
      this.entryForm.patchValue({
        ResultMonth: x,
        Type:"Monthy",
        PeriodFrom: this.addOneMonth(x,1),
        PeriodTo: this.addOneMonth(x,6),
      })
    })
    
  }
  addOneMonth(yyyymm: string,addmonth:any): string {
    // Parse the input string into a Date object
    const date = parse(yyyymm, 'yyyyMM', new Date());
  
    // Add one month to the Date object
    const modifiedDate = addMonths(date, addmonth);
  
    // Format the modified Date object as a 'yyyymm' string
    const modifiedYyyyMm = format(modifiedDate, 'yyyyMM');
  
    // Return the modified 'yyyymm' string
    return modifiedYyyyMm;
  }
  get f(){ return this.entryForm.controls;}
  initializeeEntryFormControl() {
    this.entryForm = this._fBuilder.group({
      ResultMonth: ['',[RxwebValidators.required()]],
      PeriodFrom:[''],
      PeriodTo:[''],
      Type:['Monthly',[RxwebValidators.required()]],
    })
  }
 
  onSave() {
    this.submitted = true;
    this.loading = true;
    if (this.selectedItemKeys.length == 0) {
      Swal.fire('Error', "Please select one record", 'error');
      this.loading = false;
      return;
    }
    if (this.entryForm.invalid) {
      this.loading = false;
      return;
    }
    var command = {
      ResultMonth:this.f.ResultMonth.value,
      CurrentMonth:this.f.PeriodFrom.value,
      CustomerCode: this.selectedItemKeys.map(x => x.customerCode),
      Type:this.f.Type.value,
    }
    this.transmissionService.addPreTransmissionList(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, "Pre-Transmission saved successfully"),
        error: this.handleError.bind(this)
      });
      this.onChangeType();
  }
  onChangeType(){
    var command = {Type:this.f.Type.value}
    this.dataList = this.transmissionService.getPreTransmissionCustomerList(command);
  }
  handleSuccess(msg: any) {
    Swal.fire('Success', msg, 'success');
    this.loading = false;
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
    const selectedRows = data.selectedRowsData;
    for (let i = 0; i < selectedRows.length; i++) {
      this.selectedCustomerICode = selectedRows[i].customerCode;
    }
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
}
