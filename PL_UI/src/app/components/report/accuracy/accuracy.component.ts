import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
import { numberWithCommas, replaceNullWithZero,parseFormattedNumber } from '../../../shared/helpers/utils';
import { DxPivotGridComponent } from 'devextreme-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportPivotGrid } from 'devextreme/excel_exporter';
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
  selector: 'app-accuracy',
  templateUrl: './accuracy.component.html',
  styleUrls: ['./accuracy.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class AccuracyComponent implements OnInit {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
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
  getMG3: any;
  loading: boolean = false;
  submitted = false;
  dataList: any;
  model!: NgbDateStruct;
  selected!: { startDate: Moment, endDate: Moment };
  dataSource: any;
  startMonthYear: string;
  endMonthYear: string;
  pivotFields: any[];
  customerMultiSelectSettings = {};
  fileName = "Accuracy_Report" + new Date().toDateString();
  getSaleType = [
    { id: 1, itemName: 'Direct Sales' },
    { id: 2, itemName: 'SNS' }
  ];
  rowsDataFieldArea: boolean = false;
  expenddata: boolean = false;
  accurancyData: any;
  loading1: boolean = false;
  submittedVariant = false;
  getReportVariant:any;
  @ViewChild('variantEntryModal') variantEntryModal: ElementRef;
  constructor(
    private _fBuilder: FormBuilder,
    private readonly productcategoryService: ProductcategoryService,
    private readonly masterService: MasterserviceService,
    private readonly reportService: ReportService,
    private modalService: NgbModal) {
    this.masterService.getGlobalConfigByKey("PSI_YEAR").subscribe(x => {
      this.fromMonth = new FormControl(moment(x + '04', 'YYYYMM'));
      this.toMonth = new FormControl(moment(x + 1 + '03', 'YYYYMM'));
    })
    this.loadMG1();
    this.loadReportVariant();
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
      SaleTypeId: [, [RxwebValidators.required()]],
      CustomerCode: [],
      ProductCategoryId1: [],
      ProductCategoryId2: [],
      ProductCategoryId3: [],
      Variant: []
    });
    this.expandForm = this._fBuilder.group({
      IsExpand: [false],
      IsHeader: [false]
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
  
  loadReportVariant() {
    this.reportService.getReportVariant('Accuracy').pipe()
      .subscribe(s => {
        this.getReportVariant = s;
      });
  }

  reload() {
    this.searchForm.reset();

  }
  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Accuracy');
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
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Accuracy_Report.xlsx');
    });
  });
  e.cancel = true;
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
    this.loading = true;

    let formValue = this.searchForm.getRawValue();
    formValue.CustomerCode = formValue.CustomerCode.map(c => { return c.customerCode });
    formValue.ProductCategoryId1 = formValue.ProductCategoryId1 ? formValue.ProductCategoryId1 : 0;
    formValue.ProductCategoryId2 = formValue.ProductCategoryId2 ? formValue.ProductCategoryId2 : 0;
    formValue.ProductCategoryId3 = formValue.ProductCategoryId3 ? formValue.ProductCategoryId3 : 0;
    formValue.StartMonthYear = moment(this.fromMonth.value).format('YYYYMM'),
      formValue.EndMonthYear = moment(this.toMonth.value).format('YYYYMM'),
      formValue.Variant = formValue.Variant;
    this.loaddata(formValue);
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
        store: this.accurancyData,
      };
    }
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
        ReportType: 'Accuracy',
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
    if (formValue.Variant == null) {
      Swal.fire('Error', "Please select variant", 'error');
      return;
    }

    if (dataSource) {
      const dataFields = dataSource.getAreaFields('data', true);
      const allFields = [...dataFields.map(x => x.dataField)];
      var command = {
        ReportVariantId: 1,
        ReportType: 'Accuracy',
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
  loaddata(command) {
    this.expenddata = true;
    this.expandForm.patchValue({
      IsExpand: false,
      IsHeader: false
    });
    this.reportService.getAccurencyReport(command
    ).subscribe({
      next: (data) => {
        this.loading = false;
        if (data.isSuccess) {
          this.pivotFields = data.value.dataFieldList;
          this.pivotFields.forEach(p => {
            if (p.summaryType == 'custom') {
              p.calculateSummaryValue = function (summaryCell) {
              }
            }
            else if (p.summaryType == 'sum') {

              if (p.dataField.toLowerCase() == 'nextsales_qty' || p.dataField.toLowerCase() == 'nextsales_amt') {
                p.calculateSummaryValue = (summaryCell) => {

                  var result = 0;
                  var s_QTY_2 = 0, s_QTY_3 = 0, s_QTY_4 = 0, s_AMT_2 = 0, s_AMT_3 = 0, s_AMT_4 = 0;

                  var secondMonth = summaryCell.next('column', true);
                  if (secondMonth) {
                    s_QTY_2 = secondMonth.value("sales_QTY");
                    s_AMT_2 = secondMonth.value("sales_AMT");

                    var thirdMonth = secondMonth.next('column', true);
                    if (thirdMonth) {

                      s_QTY_3 = thirdMonth.value("sales_QTY");
                      s_AMT_3 = thirdMonth.value("sales_AMT");

                      var fourthMonth = thirdMonth.next('column', true);
                      if (fourthMonth) {

                        s_QTY_4 = fourthMonth.value("sales_QTY");
                        s_AMT_4 = fourthMonth.value("sales_AMT");

                      }
                    }
                  }

                  if (p.dataField.toLowerCase() == 'nextsales_qty') {

                    if ((s_QTY_2 + s_QTY_3 + s_QTY_4) == 0) {
                      result = 0
                    }
                    else {
                      result = (s_QTY_2 + s_QTY_3 + s_QTY_4) / 3;
                    }
                  }
                  else if (p.dataField.toLowerCase() == 'nextsales_amt') {

                    if ((s_AMT_2 + s_AMT_3 + s_AMT_4) == 0) {
                      result = 0
                    }
                    else {
                      result = (s_AMT_2 + s_AMT_3 + s_AMT_4) / 3;
                    }
                  }
                  return result;
                }
              }

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
          this.accurancyData = data.value.accurancyData;
          this.dataSource = {
            fields: this.pivotFields,
            store: data.value.accurancyData,
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
  loadCustomer(saleTypeId) {
    const saleTypeIdListList = saleTypeId ? saleTypeId.map(c => c.id).join(',') : '0';
    this.masterService.getCustomersBySaleTypeId(saleTypeIdListList)
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

  loadMG1() {
    this.productcategoryService.getMgs(1).subscribe
      ({
        next: (data) => {
          this.getMG1 = data.map(el => {
            return {
              id: el.id,
              displayName: el.productCategoryCode + '-' + el.name
            }
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    this.getMG2 = null;
    this.getMG3 = null;
  }

  loadMg2(mg1Id: number) {
    this.productcategoryService.getUserMgs(2).subscribe(x => {
      this.getMG2 = x.filter(x => x.parentId.split(',').map(Number).includes(mg1Id));
    });
    this.getMG2.forEach((item) => {
      item.displayName = `${item.productCategoryCode}-${item.name}`;
    });
  }
  loadMG3(mg2Id: number) {
    this.productcategoryService.getMgs(3).subscribe
      ({
        next: (data) => {
          this.getMG3 = data.filter(x => x.parentId.split(',').map(Number).includes(mg2Id));
          this.getMG3.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`
          });
        },
        error: (error) => {
          console.log(error);
        }
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

