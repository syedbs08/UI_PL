import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterserviceService } from '../../masters/masterservice.service';
import { ProductcategoryService } from '../../masters/productcategory-master/productcategory.service';
import { Customer } from 'src/app/shared/models/customer.model';
import { ProductCategory } from 'src/app/shared/models/product-category.model';
import Swal from 'sweetalert2';
import { CustomerAccount } from 'src/app/shared/models/customer-account.model';
import { Material, MaterialList } from 'src/app/shared/models/material.model';
import { SNSPlanningSummary } from 'src/app/shared/models/sns-planning.model';
import { SNSPlanningPeriodList } from 'src/app/shared/data/common/sns-planning-period';
import { CommonLookupType } from 'src/app/shared/models/common-lookup.model';
import { SnsService } from '../sns.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import { Observable, Observer, Subject, Subscription, of } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/shared/services/un-save-change.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import CustomStore from 'devextreme/data/custom_store';
import { ErrorMsg} from 'src/app/shared/helpers/constants';

@Component({
  selector: 'app-sns-planning',
  templateUrl: './sns-planning.component.html',
  styleUrls: ['./sns-planning.component.scss']
})
export class SnsPlanningComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  private hasUnsavedData = false;
  @ViewChild('itemSelectionModal') itemSelectionModal: ElementRef;
  private unsubscribe = new Subject<void>();
  @ViewChild(UserlockComponent, { static: false }) lock: UserlockComponent;
  checkBlock: any;
  @Input() showheader = true;
  searchForm: FormGroup;
  submitted: boolean = false;
  accountList: CustomerAccount[] = [];
  customerList: Customer[] = [];
  productCategoryList: any;
  productSubCategoryList: any;
  materialList: Material[] = [];
  loading: boolean = false;
  showPlanning: boolean = false;
  snsPlanningSummary: SNSPlanningSummary;
  snsPlanningPeriodList: CommonLookupType[] = SNSPlanningPeriodList;
  snsFormValue: any;
  multipleSettings = {};
  dropdownList: { id: number; itemName: string; }[];
  tempItemList: string[];
  tableItemList: any[] = [];
  gridDataSource: any;
  gridBoxValue: number[] = [3];
  @BlockUI('form-section') blockUI: NgBlockUI;

  constructor(private readonly masterService: MasterserviceService,
    private formBuilder: FormBuilder,
    private readonly productcategoryService: ProductcategoryService,
    private readonly snsService: SnsService,
    private modalService: NgbModal, http: HttpClient) {

  }
  ngOnInit(): void {


    this.multipleSettings = {

      singleSelection: false,
      placeHolder: "Select customers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit: 1

    };

    this.creatForm();
    this.loadAccount();
    this.getProductCategoryList();
  }

  get form() { return this.searchForm.controls; }

  creatForm() {
    this.searchForm = this.formBuilder.group({
      AccountCode: new FormControl(null, [Validators.required]),
      CustomerIdList: new FormControl([], [Validators.required]),
      ProductCategoryId: new FormControl(null, [Validators.required]),
      ProductSubCategoryIdList: new FormControl(null),
      MaterialIdList: new FormControl([], [Validators.required]),
      PeriodId: new FormControl(4, [Validators.required]),
      IsWildCardSearch: new FormControl(false, [Validators.required]),
      SearchedMaterialCode: new FormControl(null, []),
      IsStockDays: new FormControl(false),
    });
  }

  get isWildCardSearch() {
    return this.searchForm.getRawValue().IsWildCardSearch;
  }

  loadAccount() {
    this.masterService.getAccounts()
      .subscribe({
        next: (data) => {
          this.accountList = data;
          this.accountList.forEach((item) => {
            item.displayName = `${item.accountCode}-${item.accountName}`;
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  onCustomerAccountChange() {
    this.customerList = [];
    this.searchForm.get('CustomerIdList')?.setValue([]);
    this.getCustomerList();
    this.getPlannedCustomer();
  }

  getCustomerList() {
    const accountCode = this.searchForm.getRawValue().AccountCode;
    if (accountCode) {
      const accountId = this.accountList.find(c => c.accountCode === accountCode)?.accountId;
      this.masterService.getCustomersByAccount(Number(accountId)).subscribe({
        next: (data) => {
          this.customerList =
            data.map(el => {
              return {
                customerId: el.customerId,
                customerCode: el.customerCode,
                customerName: el.customerCode + '-' + el.customerName,
                id: el.customerId,
                itemName: el.customerCode + '-' + el.customerName
              }
            });

        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }

  getPlannedCustomer() {

    if (this.form.PeriodId.valid) {
      this.form["CustomerIdList"].reset();
      let materialCodes;
      if (this.isWildCardSearch) {
        materialCodes = this.form["SearchedMaterialCode"].value.toString();

      }
      else {
        let formValue = this.searchForm.getRawValue();
        if (formValue.MaterialIdList && formValue.MaterialIdList.length > 0) {
          materialCodes = formValue.MaterialIdList;
        }

      }
      if (materialCodes && materialCodes.length > 0) {
        var command = {
          AccountCode: this.form["AccountCode"].value,
          MaterialCode: materialCodes.toString(),

        }

        this.snsService.getPlannedCustomer(command).subscribe({
          next: (data) => {
            if (data.length > 0) {

              this.searchForm.patchValue({
                CustomerIdList: data
              })
            }

          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }
  }
  getProductCategoryList() {
    this.productcategoryService.getUserMgs(2).subscribe({
      next: (data) => {
        this.productCategoryList = data.map(el => {
          return {
            id: el.id,
            itemName: el.productCategoryCode + '-' + el.name
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.productSubCategoryList = [];
  }

  changeItemCode(event: any) {

    this.searchForm.get('CustomerIdList')?.setValue([]);
    this.getPlannedCustomer();
  }
  onProductCategoryChange(selectedProductCat) {
    this.productSubCategoryList = [];
    this.searchForm.get('ProductSubCategoryIdList')?.setValue([]);
    this.searchForm.get('CustomerIdList')?.setValue([]);
    this.getMaterialList();

    this.getProductSubCategoryList(selectedProductCat);

  }

  getProductSubCategoryList(selectedsubcat) {
    if (selectedsubcat != null) {
      this.productSubCategoryList = [];
      const productCategoryId = selectedsubcat ? selectedsubcat.map(c => c.id).join(',') : '0';

      if (productCategoryId) {

        this.productcategoryService.getUserMgs(3).subscribe({
          next: (data) => {
            this.productSubCategoryList = data.filter(x => {
              const parentIds = x.parentId.split(',');
              return productCategoryId.split(',').some(id => parentIds.includes(id));
            });
            this.productSubCategoryList.forEach((item) => {
              item.itemName = `${item.productCategoryCode}-${item.name}`;
            });
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }
  }

  onProductSubCategoryChange(selectedProducttype) {
    this.materialList = [];
    this.searchForm.get('MaterialIdList')?.setValue([]);
    this.searchForm.get('CustomerIdList')?.setValue([]);
    this.getMaterialList();
  }
  makeAsyncDataSource(materialList) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'materialCode',
      load() {
        const materialListObservable = of(materialList);
        return lastValueFrom(materialListObservable);

      },
    });
  }
  getMaterialList() {
    let formValue = this.searchForm.getRawValue();
    var productCategoryId = formValue.ProductCategoryId ? formValue.ProductCategoryId.map(c => { return c.id }) : [0];
    var productSubCategoryIds = formValue.ProductSubCategoryIdList ? formValue.ProductSubCategoryIdList.map(c => { return c.id }) : [0];
    var command = {
      MG1: productCategoryId,
      MG2: productSubCategoryIds

    }
    this.blockUI.start();

    this.masterService.getMaterialByCategorySubCategories(command).subscribe({
      next: (data) => {
        this.materialList = data;
        this.blockUI.stop();
        this.gridDataSource = this.makeAsyncDataSource(this.materialList);
      },
      error: (error) => {
        console.log(error);
      }

    });

  }

  clearForm() {
    this.searchForm.reset();
  }
  onSearch() {
    if (!this.searchForm.valid) {
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    let formValue = this.searchForm.getRawValue();
    formValue.MaterialCodeList = formValue.MaterialIdList;
    //formValue.MaterialIdList = formValue.MaterialIdList.map(c => { return c.materialId });
    formValue.CustomerCodeList = formValue.CustomerIdList.map(c => { return c.customerCode });
    formValue.CustomerIdList = formValue.CustomerIdList.map(c => { return c.customerId });
    formValue.ProductCategoryId = formValue.ProductCategoryId.map(c => { return c.id });
    formValue.ProductSubCategoryIdList = formValue.ProductSubCategoryIdList ? formValue.ProductSubCategoryIdList.map(c => { return c.id }) : null;
    this.loading = true;

    this.snsFormValue = formValue;

    this.snsService.getSNSPlanning(formValue).subscribe({
      next: (data) => {
        console.log(data);
        this.loading = false;
        if (data.isSuccess) {
          this.snsPlanningSummary = data.value;
          this.showPlanning = true;
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
  onPrevious() {
    if (this.hasUnsavedData == true) {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure ?',
        html: 'Some unsaved changes detected ,make sure you have saved your changes before leaving . click on Submit button to save your changes ',
        showCancelButton: true,
        confirmButtonColor: '#7367f0',
        cancelButtonColor: '#337ab7',
        confirmButtonText: 'Yes, leave this page',
        cancelButtonText: 'Stay',
        reverseButtons: true

      }).then((result) => {
        if (result.isConfirmed) {
          this.hasUnsavedData = false;
          this.goBack();
        }
      })
    }
    else {

      this.goBack();
    }

  }
  goBack() {
    this.showPlanning = false;
    if (this.snsPlanningSummary) {
      this.snsPlanningSummary.monthList = [];
      this.snsPlanningSummary.planningData = [];
    }
  }
  onSubmit() {
    console.log('sumbit', this.snsPlanningSummary);
    this.loading = true;
    setTimeout(() => {
      const updateValue = {
        SNSPlanning: this.snsFormValue,
        SNSPlanningList: this.snsPlanningSummary.planningData.filter(c => c.isUpdated && c.description != 'Stock Days')
      };
      this.snsService.updateSNSPlanning(updateValue).subscribe({
        next: (data) => {
          console.log(data);
          this.loading = false;
          if (data.isSuccess) {
            this.hasUnsavedData = false;
            Swal.fire('Success', "SNS Planning updated successfully", 'success');
            this.onPrevious();


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
    }, 200);
  }

  onIsWildCardSearchChange() {
    this.searchForm.get('CustomerIdList')?.setValue([]);
    if (this.isWildCardSearch) {
      this.searchForm.get('SearchedMaterialCode')?.setValidators(Validators.required);
      this.searchForm.get('SearchedMaterialCode')?.updateValueAndValidity();
      this.searchForm.get('MaterialIdList')?.setValidators([]);
      this.searchForm.get('MaterialIdList')?.updateValueAndValidity();
      this.searchForm.get('MaterialIdList')?.setValue([]);
    }
    else {
      this.searchForm.get('MaterialIdList')?.setValidators(Validators.required);
      this.searchForm.get('MaterialIdList')?.updateValueAndValidity();
      this.searchForm.get('SearchedMaterialCode')?.setValidators([]);
      this.searchForm.get('SearchedMaterialCode')?.updateValueAndValidity();
      this.searchForm.get('SearchedMaterialCode')?.setValue(null);
    }
  }



  detectChanged(event) {
    this.hasUnsavedData = event;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasUnsavedData) {
      return new Observable((observer: Observer<boolean>) => {

        Swal.fire({
          icon: 'warning',
          title: 'Are you sure ?',
          html: 'Some unsaved changes detected ,make sure you have saved your changes before leaving . click on Submit button to save your changes ',
          showCancelButton: true,
          confirmButtonColor: '#7367f0',
          cancelButtonColor: '#337ab7',
          confirmButtonText: 'Yes ,Leave this page',
          cancelButtonText: 'Stay',
          reverseButtons: true

        }).then((result) => {
          if (result.isConfirmed) {
            observer.next(true);
            observer.complete();
          }
          else {
            observer.next(false);
            observer.complete();
          }

        });
      });
    }
    else {
      return of(true);
    }

  }
  ngOnDestroy() {
    this.unsubscribe.next();
  }


  /// item selection
  openItemSelectionpopup() {
    this.modalService.open(this.itemSelectionModal, { backdrop: 'static' });
  }

  onPaste(event: ClipboardEvent) {
    let columnName = "";
    let clipboardData = event.clipboardData!;
    let pastedText = clipboardData.getData('text');
    let row_data = pastedText.replace(" ", '').split('\n');
    this.tempItemList = row_data[0].split('\t');
    columnName = this.tempItemList[0].replace(" ", '');
    delete row_data[0];
    let data: any[] = [];
    row_data.forEach(row_data => {
      let row = {};
      this.tempItemList.forEach((a, index) => {
        row[a] = row_data.replace(" ", '').split('\t')[index].replace(" ", '')
      });
      data.push(row);
    })
    this.tableItemList = data.map(x => x[columnName].replace("\r", ''));
  }
  clearCopiedItems() {
    this.tableItemList.splice(0, this.tableItemList.length);
  }

  AddCopiedMaterial() {
   const materialsList = this.materialList.filter(item => this.tableItemList.includes(item.materialCode));
    this.searchForm.patchValue({
      MaterialIdList: materialsList.map(x => x.materialCode)
    })
    if (this.searchForm.get('MaterialIdList')?.value.length == 0) {

      Swal.fire('Error', "Seems there is not a valid Material code in the list", 'error');
    }

    this.modalService.dismissAll();
  }

}

