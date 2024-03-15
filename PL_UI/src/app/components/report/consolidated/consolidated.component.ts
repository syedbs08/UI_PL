import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductcategoryService } from 'src/app/components/masters/productcategory-master/productcategory.service';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Customer } from 'src/app/shared/models/customer.model';
import { ReportService } from '../report.service';
import Swal from 'sweetalert2';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { numberWithCommas, replaceNullWithZero ,parseFormattedNumber} from '../../../shared/helpers/utils';
import { DxPivotGridComponent } from 'devextreme-angular';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorMsg} from 'src/app/shared/helpers/constants';
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
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styleUrls: ['./consolidated.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ConsolidatedComponent implements OnInit {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  consolidatedData: any;
  fromMonth = new FormControl();
  toMonth = new FormControl();
  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;
  customerList: Customer[] = [];
  getCountry: any;
  getCustomer: any;
  getMG1: any;
  getMG2: any;
  loading: boolean = false;
  loading1:boolean = false;
  expenddata: boolean = false;
  submitted = false;
  submittedVariant = false;
  dataList: any;
  model!: NgbDateStruct;
  selected!: { startDate: Moment, endDate: Moment };
  dataSource: any;
  startMonthYear: string;
  endMonthYear: string;
  pivotFields: any[];
  getDepartment: any;
  rowsDataFieldArea: boolean = false;
  fileName = "Consolidated_Report" + new Date().toDateString();
  customerMultiSelectSettings = {};
  getReportVariant: any;
  @ViewChild('variantEntryModal') variantEntryModal: ElementRef;
  constructor(private _fBuilder: FormBuilder,
    private readonly productcategoryService: ProductcategoryService,
    private readonly masterService: MasterserviceService,
    private readonly reportService: ReportService,
    private modalService: NgbModal) {
    this.masterService.getGlobalConfigByKey("PSI_YEAR").subscribe(x => {
      this.fromMonth = new FormControl(moment(x + '04', 'YYYYMM'));
      this.toMonth = new FormControl(moment(x + 1 + '03', 'YYYYMM'));
    })
    this.loadDepartment();
    this.loadMG1();
    this.loadReportVariant();
  }

  loadDepartment() {
    this.masterService.getdepartmentLookup().pipe()
      .subscribe(s => {
        this.getDepartment = s.map(el => {
          return {
            departmentName: el.departmentCode + "-" + el.departmentName,
            departmentId: el.departmentId,
            id: el.departmentId,
            itemName: el.departmentCode + '-' + el.departmentName
          }
        });
      });
  }
  loadReportVariant() {
    this.reportService.getReportVariant('Consoli').pipe()
      .subscribe(s => {
        this.getReportVariant = s;
      });
  }

  dataFieldHeaderClick(event: Event) {
    this.rowsDataFieldArea = this.expendf.IsHeader.value;
  }
  expandAllRows(event: Event) {
    const isexpand = this.expendf.IsExpand.value;

    const dataSource = this.pivotGrid.instance.getDataSource();
    if (dataSource) {
      const fields = dataSource.getAreaFields('row', true);
      fields.forEach(field => {
        field.expanded = isexpand;
      });
      const rowFields = dataSource.getAreaFields('row', true);
      const columnFields = dataSource.getAreaFields('column', true);
      const dataFields = dataSource.getAreaFields('data', true);
      const allFields = [...rowFields, ...columnFields, ...dataFields];
      this.dataSource = {
        fields: allFields,
        store: this.consolidatedData,
      };
    }
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
  getAdditional = [
    { id: "BP", name: 'BP' },
    { id: "LM", name: 'LM' },
    { id: "LY", name: 'LY' },
  ];
  ngOnInit(): void {
    this.initializeFormControl();

  }
  citySelector(data) {
    return `${data.city} (${data.country})`;
  }

  searchForm: FormGroup;
  expandForm: FormGroup;
  variantForm: FormGroup;
  get variantf() { return this.variantForm.controls; }
  get expendf() { return this.expandForm.controls; }
  get f() { return this.searchForm.controls; }
  initializeFormControl() {
    this.searchForm = this._fBuilder.group({
      DepartmentId: [, [RxwebValidators.required()]],
      CountryId: [, [RxwebValidators.required()]],
      CustomerCode: [],
      ProductCategoryId1: [],
      ProductCategoryId2: [],
      SalesSubType: [, [RxwebValidators.required()]],
      AdditionalValue: [],
      Variant: []
    });
    this.expandForm = this._fBuilder.group({
      IsExpand: [false],
      IsHeader: [false],
    })
    this.variantForm = this._fBuilder.group({
      VariantName: [, [RxwebValidators.required()]]
    })
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
  reload() {
    this.searchForm.reset();

  }
  resetVariant() {
    this.variantForm.reset();
    this.submittedVariant = false;
    this.loading1 = false;
    this.modalService.dismissAll('Close click');
  }
  onAddNewClick($event: boolean) {
    this.resetVariant();
    if ($event) {
      this.modalService.open(this.variantEntryModal, { backdrop: 'static' });
    }
  }
  onSaveAsVariant() {
    this.submittedVariant = true;
    if (this.variantForm.invalid) {
      return;
    }

    let formValue = this.variantForm.getRawValue();
    const dataSource = this.pivotGrid.instance.getDataSource();
    if (dataSource) {
      const dataFields = dataSource.getAreaFields('data', true);
      const allFields = [...dataFields.map(x => x.dataField)];

      if (allFields.length == 0) {
        Swal.fire('Error', "Please select column", 'error');
        return;
      }
      var command = {
        ReportVariantId: 0,
        ReportType: 'Consoli',
        VariantName: formValue.VariantName,
        ColumnName: allFields,
      }
      this.loading1 = true;
      this.masterService.AddVariant(command)
        .pipe()
        .subscribe({
          next: this.handleSuccess.bind(this),
          error: this.handleError.bind(this)
        });
    }
  }
  onSave() {
    
    const dataSource = this.pivotGrid.instance.getDataSource();
    let formValue = this.searchForm.getRawValue();
    if(formValue.Variant==null){
      Swal.fire('Error', "Please select variant", 'error');
      return;
    }
   
    if (dataSource) {
      const dataFields = dataSource.getAreaFields('data', true);
      const allFields = [...dataFields.map(x => x.dataField)];
      var command = {
        ReportVariantId: 1,
        ReportType: 'Consoli',
        VariantName: formValue.Variant,
        ColumnName: allFields,
      }
      this.loading = true;
      this.masterService.AddVariant(command)
        .pipe()
        .subscribe({
          next: this.handleUpdateSuccess.bind(this),
          error: this.handleError.bind(this)
        });
    }
  }
  handleUpdateSuccess() {
    this.loading = false;
    Swal.fire('Success', "Variant updated successfully", 'success');
  }
  handleSuccess() {
   
    this.resetVariant();
    Swal.fire('Success', "Variant added successfully", 'success');
   
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
    this.submitted = false;

  }
  onSearch() {
    this.submitted = true;

    if (this.searchForm.invalid) {
      return;
    }
    if (!this.fromMonth) {
      return;
    }
    if (!this.toMonth) {
      return;
    }
    let formValue = this.searchForm.getRawValue();
    formValue.CustomerCode = formValue.CustomerCode.map(c => { return c.customerCode });
    formValue.ProductCategoryId1 = formValue.ProductCategoryId1 ? formValue.ProductCategoryId1 : 0;
    formValue.ProductCategoryId2 = formValue.ProductCategoryId2 ? formValue.ProductCategoryId2 : 0;
    formValue.SalesSubType = formValue.SalesSubType,
      formValue.StartMonthYear = moment(this.fromMonth.value).format('YYYYMM'),
      formValue.EndMonthYear = moment(this.toMonth.value).format('YYYYMM'),
      formValue.AdditionalValue = formValue.AdditionalValue == null ? null : formValue.AdditionalValue;
    formValue.Variant = formValue.Variant;
    this.loaddata(formValue);
    this.loading = true;
  }
  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Consoli');
    exportPivotGrid({
      component: e.component,
      worksheet,
      customizeCell: ({ pivotCell, excelCell }) => {
        if (pivotCell && (typeof pivotCell.value === 'string' || typeof pivotCell.value === 'number')) {
          const parsedNumber = parseFormattedNumber(pivotCell.value.toString());
          excelCell.value = parsedNumber;
        }
      }
    })
      .then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          // Save the exported file
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Consolidated_Report.xlsx');
        });
      });
      e.cancel = true;
  }
  loaddata(command) {
    this.expenddata = true;
    this.expandForm.patchValue({
      IsExpand: false,
      IsHeader: false
    });
    this.reportService.getConsolidatedReport(command
    ).subscribe({

      next: (data) => {
        this.loading = false;
        if (data.isSuccess) {
          this.pivotFields = data.value.dataFieldList;

          this.pivotFields.forEach(p => {
            if (p.summaryType == 'custom') {
              p.calculateSummaryValue = function (summaryCell) {
                var result = 0;
                if (p.dataField == 'gp_Percentage') {
                  if (summaryCell.value("gp_AMT") && summaryCell.value("amount")) {
                    result = (summaryCell.value("gp_AMT") / summaryCell.value("amount")) * 100;
                  }
                }
                else if (p.dataField == 'bpGp_Percentage') {
                  if (summaryCell.value("bpGp_AMT") && summaryCell.value("bp_AMT")) {
                    result = (summaryCell.value("bpGp_AMT") / summaryCell.value("bp_AMT")) * 100;
                  }
                }
                else if (p.dataField == 'lmGp_Percentage') {
                  if (summaryCell.value("lmGp_AMT") && summaryCell.value("lm_AMT")) {
                    result = (summaryCell.value("lmGp_AMT") / summaryCell.value("lm_AMT")) * 100;
                  }
                }
                else if (p.dataField == 'lyGp_Percentage') {
                  if (summaryCell.value("lyGp_AMT") && summaryCell.value("ly_AMT")) {
                    result = (summaryCell.value("lyGp_AMT") / summaryCell.value("ly_AMT")) * 100;
                  }
                }
                return result.toFixed(2);
              }
            }
            if (p.summaryType == 'sum') {
              if (p.dataField.toLowerCase().indexOf('qty') > -1 || p.dataField.toLowerCase().indexOf('quantity') > -1) {
                p.customizeText = (e) => {
                  var currentValue = parseInt(replaceNullWithZero(e.valueText));
                  return numberWithCommas(currentValue);
                }
              }
              else {
                p.customizeText = (e) => {
                  var currentValue = parseFloat(replaceNullWithZero(e.valueText)).toFixed(2);
                  return numberWithCommas(currentValue);
                }
              }

            }
          });
          this.consolidatedData = data.value.consolidatedData;
          this.dataSource = {
            fields: this.pivotFields,
            store: data.value.consolidatedData,
          };

        }
        else {
          if (data.errors) {
            Swal.fire('Error', data.errors.join('. '), 'error');
          }
          else {
            Swal.fire('Error', ErrorMsg, 'error');
          }
        }
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
        Swal.fire('Error', ErrorMsg, 'error');
      }
    });
  }
  loadCustomer(countryId) {
    const countryIdList = countryId ? countryId.map(c => c.countryId).join(',') : '0';
    this.masterService.getCustomersByUserCountryIds(countryIdList)
      .pipe()
      .subscribe({
        next: (x) => (
          this.getCustomer = x.map(el => {
            return {
              customerCode: el.customerCode,
              customerName: el.customerCode + '-' + el.customerName,
              id: el.customerId,
              itemName: el.customerCode + '-' + el.customerName

            }
          })
        ),
        error: (x) => (console.log(x))
      });
  }
  onDepartmentSelect(departmentId: any) {
    const departmentIdList = departmentId ? departmentId.map(c => c.departmentId).join(',') : '0';
    this.masterService.countryLookupByDepartment(departmentIdList).pipe()
      .subscribe(s => {
        this.getCountry = s.map(el => {
          return {
            countryName: el.countryCode + "-" + el.countryName,
            countryId: el.countryId,
            id: el.countryId,
            itemName: el.countryCode + '-' + el.countryName
          }
        });
      });
  }
  loadMG1() {
    this.productcategoryService.getUserMgs(2).subscribe(x => {
      this.getMG1 = x;
      this.getMG1.forEach((item) => {
        item.displayName = `${item.productCategoryCode}-${item.name}`;
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
}
