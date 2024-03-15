import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TransmissionService } from '../transmission.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from '../../masters/masterservice.service';
import { DatePipe } from '@angular/common';
import { parse, addMonths, format } from 'date-fns';
import { ResultMonthName} from 'src/app/shared/helpers/constants';
@Component({
  selector: 'app-transmission-data',
  templateUrl: './transmission-data.component.html',
  styleUrls: ['./transmission-data.component.scss']
})
export class TransmissionDataComponent implements OnInit {
  planTypeList: any;
  customerlist: any;
  loading = false;
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  lastMonthDate: any;
  transmissionList: any;
  periodFrom: any;
  periodTo: any;
  constructor(
    private readonly transmissionService: TransmissionService,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.getPlanType();
    this.loadData();
  }

  tranmissionForm: FormGroup;
  ngOnInit(): void {
    this.initializeFormControl();
    this.masterService.getGlobalConfigByKey(ResultMonthName).subscribe(x => {
      this.tranmissionForm.patchValue({
        ResultMonth: x,
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
  loadData() {
    this.transmissionList = this.transmissionService.getTransmitDataList();
  }

  get f() { return this.tranmissionForm.controls; }

  initializeFormControl() {
    this.tranmissionForm = this._fBuilder.group({
      CustomerCode: [, [RxwebValidators.required()]],
      PlanTypeCode: [, [RxwebValidators.required()]],
      TransmissionListId: [0],
      SalesType: ['', [RxwebValidators.required()]],
      ResultMonth: ['', RxwebValidators.required()],
      PeriodFrom: ['', RxwebValidators.required()],
      PeriodTo: ['']

    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.tranmissionForm.invalid) {
      return;
    }
    this.loading = true;
    this.transmissionService.addTransmit(this.f.PlanTypeCode.value, this.f.ResultMonth.value, this.f.CustomerCode.value, this.f.PeriodFrom.value, this.f.SalesType.value)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "Transmission added successfully", 'success');
    this.loadData();
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;

  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  resetForm() {
    this.customerlist = null;
    this.tranmissionForm.patchValue({
      CustomerCode: null,
      PlanTypeCode: null,
      SalesType: null,
    })
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
  onChangeSaleType(planTypeCode: string, saletype: string) {
    this.tranmissionForm.patchValue({
      CustomerCode: null,
    });
    if (saletype == "") {
      this.customerlist = null;
      return;
    }
    this.transmissionService.getTransmissionCustomerByPlanTypeBySaleType(planTypeCode, saletype)
      .subscribe({
        next: (data) => {
          this.customerlist = data.map(el => { return { customerCode: el.customerCode, customerName: el.customerCode + '-' + el.customerName } })
        },
        error: (error) => {
          console.log(error);
        }
      });

  }


}
