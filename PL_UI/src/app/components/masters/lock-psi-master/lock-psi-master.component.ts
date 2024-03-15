import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterserviceService } from '../masterservice.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductcategoryService } from '../productcategory-master/productcategory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import Swal from 'sweetalert2';
import { LockPsiConstants } from 'src/app/shared/helpers/constants';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import DataSource from 'devextreme/data/data_source';
@Component({
  selector: 'app-lock-psi-master',
  templateUrl: './lock-psi-master.component.html',
  styleUrls: ['./lock-psi-master.component.scss']
})
export class LockPsiMasterComponent implements OnInit {
  @ViewChild(UserlockComponent, { static: false }) lock: UserlockComponent;
  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;
  showTable: boolean = false;
  isReadOnly: boolean = true;
  dataList: any;
  getUsers: any;
  getMG1: any;
  listvalue: any;
  getCustomers: any;
  customerMultiSelectSettings: any;
  fileName = "PSI_Lock_" + new Date().toDateString();
  allMode: "allPages";
  checkboxState: boolean = false;
  checkBoxesMode: "always";
  loading1: boolean = false;
  loading: boolean = false;
 
  submitted:boolean = false;
  @ViewChild('lockPSIEntryModal') lockPSIEntryModal: ElementRef;
  @ViewChild('dataGridRef', { static: false }) dataGrid: DxDataGridComponent;

  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private readonly masterService: MasterserviceService,
    private modalService: NgbModal,
    private readonly productcategoryService: ProductcategoryService,
    private _fBuilder: FormBuilder
  ) {
    this.loadUsers();
    this.loadCustomer();
    this.loadMG1();
  }
  searchForm: FormGroup;
  lockPSIForm: FormGroup;

  ngOnInit(): void {
    this.initializeSearchControl();
    this.initializeEntryFormControl();
    this.customerMultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Select customers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit: 1
    };
  }


  resetForm() {
    this.lockPSIForm.reset({ LockPSIId: 0 });
    this.submitted = false;
    this.loading = false;
  }
  initializeSearchControl() {
    this.searchForm = this._fBuilder.group({
      CustomerId: ['', [RxwebValidators.required()]],
      SubcategoryId: ['', [RxwebValidators.required()]],
      UserIds: ['', [RxwebValidators.required()]],
      IsBlock: [false]
    });
  }
  loadUsers() {
    this.masterService.getActiveUsers()
      .pipe()
      .subscribe({
        next: (data) => {
          this.getUsers = data.map(el => {
            return {
              id: el.userId,
              userId: el.userId,
              itemName: el.name,
              name: el.name
            }
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }


  initializeEntryFormControl() {
    this.lockPSIForm = this._fBuilder.group({
      UserIds: [, [RxwebValidators.required()]],
      CustomerId: [, [RxwebValidators.required()]],
      SubcategoryId: [, [RxwebValidators.required()]],
      Types: [],
      LockPSIId: [0]
    });
  }
  reload() {

    this.modalService.dismissAll('Close click');
  }
  handleSuccessAll(data: number) {
    const islock=this.f.IsBlock.value;
    if(islock==false)
    {
      Swal.fire('Success', "Unblock all user successfully", 'success');
    }
    else{
      Swal.fire('Success', "Block all user successfully", 'success');
    }
    this.loading = false;
    this.submitted = false;
  }
  handleSuccess(data: number) {
    this.loading = false;
    this.submitted = false;
    //this.loaddata();
    Swal.fire('Success', "Lock PSI added successfully", 'success');

  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;

  }
  loaddata() {

    var command = {
      UserIds: this.f.UserIds.value ? this.f.UserIds.value.map(c => c.id).join(",") : '',
      SubcategoryCodes: this.f.SubcategoryId.value ? this.f.SubcategoryId.value.map(c => c.productCategoryCode).join(",") : '',
      CustomerCodes: this.f.CustomerId.value ? this.f.CustomerId.value.map(c => c.customerCode).join(",") : '',
    }
    this.loading = true;
    this.submitted = true;
    this.dataList = this.masterService.getLockPSI(command);
    if (this.dataList && this.dataList.loadOptions && this.dataList.loadOptions.data) {
      this.Collapsetoggle8();
    }

    this.showTable = true;
    this.loading = false;
  }
  get f() { return this.searchForm.controls; }
  get entryf() { return this.lockPSIForm.controls; }

  onLock() {
    this.submitted = true;
    this.loading = true;
    this.masterService.getLockAllUser(this.f.IsBlock.value)
      .pipe()
      .subscribe({
        next: this.handleSuccessAll.bind(this),
        error: this.handleError.bind(this)
      });


  }
  onSearch() {
    if (this.searchForm.invalid) {
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    this.loaddata();
  }


  loadMG1() {
    this.productcategoryService.getMgs(2).subscribe({
      next: (data) => {
        this.getMG1 = data.map(el => {
          return {
            id: el.id,
            itemName: el.productCategoryCode + '-' + el.name,
            productCategoryCode: el.productCategoryCode
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadCustomer() {
    this.masterService.getCustomers()
      .pipe()
      .subscribe(x => {
        this.getCustomers = x;
        this.getCustomers.forEach((item) => {
          item.customerName = `${item.customerName}`,
            item.id = `${item.customerId}`,
            item.itemName = item.customerCode + '-' + item.customerName,
            item.customerCode = item.customerCode;
        })
      });
  }

  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  CollapsetoggleList8() {
    this.isCollapsedList8 = !this.isCollapsedList8;
  }
  ClosetoggleList8() {
    this.isClosedList8 = true
  }

  handleValueChange(e, data) {
      if (this.dataGrid) {
        const gridInstance = this.dataGrid.instance;
        if (gridInstance) {
          gridInstance.beginUpdate();
        var totalCount=  gridInstance.totalCount();
        for (var i = 0; i < totalCount; i++) {
          if (e.value == true) {
            gridInstance.cellValue(i, data.column.dataField, true);
          }
          else {
            gridInstance.cellValue(i, data.column.dataField, false);
          }
        }
        }
        gridInstance.endUpdate();
      }
    }
    // if (data.rowType == "header") {
    //   var totalCount = this.dataGrid.instance.getVisibleRows().length;
    //   // var totalCount=  this.dataGrid.instance.totalCount();
    //   for (var i = 0; i < totalCount; i++) {
    //     if (e.value == true) {
    //       this.dataGrid.instance.cellValue(i, data.column.dataField, true);
    //     }
    //     else {
    //       this.dataGrid.instance.cellValue(i, data.column.dataField, false);
    //     }
    //   }
    // }
    //}

    onClick(event): void {
      event.stopPropagation();
    }

    setHeaderValue(data) {
      var ischecked = data.value;
      if (data.rowType === "header") {
        var totalCount = this.dataGrid.instance.getVisibleRows().length;

        for (var i = 0; i < totalCount; i++) {
          if (this.dataGrid.instance.cellValue(i, data.column.dataField) == false) {
            ischecked = false;
            return ischecked;
            break;
          }
          else {
            ischecked = true;
            return ischecked;
            break;

          }
        }

      }
      return ischecked;

    }

    onSubmitLock() {
      let submmitCommand: any[] = [];

      //later move to modal class

      this.dataGrid.instance.getVisibleRows()
        .forEach((row) => {
          if (row.rowType === 'data') {
            var object = this.getObject();
            object.UserId = row.data["userId"];
            object.CustomerCode = row.data["customerCode"];
            object.SubCategoryCode = row.data["subCategoryCode"];
            object.OPSI_Upload = row.data["opsI_Upload"];
            object.COG_Upload = row.data["coG_Upload"];
            object.OC_IndicationMonth = row.data["oC_IndicationMonth"];
            object.O_LockMonthConfirm = row.data["o_LockMonthConfirm"];
            object.BP_Upload_DirectSale = row.data["bP_Upload_DirectSale"];
            object.BP_Upload_SNS = row.data["bP_Upload_SNS"];
            object.BP_COG_Upload = row.data["bP_COG_Upload"];
            object.ADJ_Upload = row.data["adJ_Upload"];
            object.SSD_Upload = row.data["ssD_Upload"];
            object.SNS_Sales_Upload = row.data["snS_Sales_Upload"];
            object.Forecast_Projection = row.data["forecast_Projection"];
            object.SNS_Planning = row.data["snS_Planning"];
            submmitCommand.push(object);
          }
        });


      this.loading = true;
      this.masterService.addLockPIS(submmitCommand, this.f.UserIds.value)
        .pipe()
        .subscribe({
          next: this.handleSuccess.bind(this),
          error: this.handleError.bind(this)
        });
    }
    getObject() {

      var object = {
        "UserId": null, "CustomerCode": null, "SubCategoryCode": null,
        "OPSI_Upload": null, "COG_Upload": null, "OC_IndicationMonth": null, "O_LockMonthConfirm": null,
        "BP_Upload_DirectSale": null, "BP_Upload_SNS": null, "ADJ_Upload": null, "BP_COG_Upload": null,
        "SSD_Upload": null, "SNS_Sales_Upload": null, "Forecast_Projection": null,
        "SNS_Planning": null
      };
      return object;

    }

    // onCellPrepared(e) {


    //   if (e.rowType == "header") {
    //     var setHeaderValue = false;
    //     var totalCount = this.dataGrid.instance.getVisibleRows().length;

    //     for (var i = 0; i < totalCount; i++) {

    //       if (this.dataGrid.instance.cellValue(i, e.column.dataField) == false) {
    //         setHeaderValue = false;
    //         break;

    //       }
    //       else {
    //         setHeaderValue = true;

    //       }
    //     }

    //   }
    // }
  }
