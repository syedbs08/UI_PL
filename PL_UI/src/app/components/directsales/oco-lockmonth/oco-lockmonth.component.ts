import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DirectsalesService } from '../directsales.service';
import { ProductcategoryService } from '../../masters/productcategory-master/productcategory.service';
import { MasterserviceService } from '../../masters/masterservice.service';
import Swal from 'sweetalert2';
import { S } from '@angular/cdk/keycodes';
import { DxDataGridComponent } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { UserblockService } from 'src/app/shared/services/userblock.service';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
@Component({
  selector: 'app-oco-lockmonth',
  templateUrl: './oco-lockmonth.component.html',
  styleUrls: ['./oco-lockmonth.component.scss']
})
export class OcoLockmonthComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(UserlockComponent,{static:false} ) lock: UserlockComponent ;
  checkBlock: any; 
  lockmonthForm: FormGroup;
  loading = false;
  countryList: any;
  companyList: any;
  // this need to be removed 
  getCustomerType = [
    { id: true, name: 'Collabo' },
    { id: false, name: 'Non-Collabo' },
  ];
  customerMultiSelectSettings = {};
  productCategoryId1MultiSelectSettings = {};
  productCategoryId2MultiSelectSettings = {};
  customerList: any;
  productList: any;
  getMG2: any;
  ocoLockMonthGrid: any;
  selectedRows: any[] = [];
  visible: boolean = false
  Oco_Lock_MonthFileName = "CurrentMonthLock" + new Date().toDateString();
  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;

  constructor(private readonly directService: DirectsalesService,
    private readonly masterService: MasterserviceService,
    private readonly productcategoryService: ProductcategoryService,
    private _fBuilder: FormBuilder,
    private userBlockService: UserblockService,  
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
 
    this.initializeFormControl();
    this.BindDDL();

  }
  BindDDL() {
    this.masterService.getCompanies().subscribe(s => {
      this.companyList = s.map(m => { return { companyName: m.companyCode + "-" + m.companyName, companyId: m.companyId } })
    });
    this.masterService.userCountryLookup().pipe()
      .subscribe(s => {
        this.countryList = s.map(el => { return { countryName: el.countryCode + "-" + el.countryName, countryId: el.countryId } });
      });
    this.productcategoryService.getUserMgs(2).subscribe(x => {
      this.productList = x;
      this.productList.forEach((item)=> {
        item.displayName = `${item.productCategoryCode}-${item.name}`,
        item.itemName = `${item.productCategoryCode}-${item.name}`;
      });
    });
  }
  
    initializeFormControl() {
      this.lockmonthForm = this._fBuilder.group({
        company: [],
        customerType:[],
        customer:[],
        productcategory:[],
        productsubcategory:[]
      });

      
    this.productCategoryId1MultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Product Sub-Category",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit:1
    };

    this.productCategoryId2MultiSelectSettings = {
      singleSelection: false,
      placeHolder: "Product Type",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit:1
    };

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
    loadCustomer(customerType: boolean) {
      this.masterService.getCollaboNonCollaboCustomersByUserCountryIds(customerType, null,"Direct")
        .pipe()
        .subscribe({
          next: (x) => (
            this.customerList = x.map(el => { return { 
              customerId: el.customerId, 
              customerName: el.customerCode + '-' + el.customerName ,
              id: el.customerId,
              itemName: el.customerCode + '-' + el.customerName
            } })
          ),
          error: (x) => (console.log(x))
        });
    }
    get f() { return this.lockmonthForm.controls; }

  loadMg2(productId: number) {
    this.getMG2 = null;
    this.productcategoryService.getUserMgs(3).subscribe(x => {
      this.getMG2 = x.filter(x => x.parentId.split(',').map(Number).includes(productId));
    });
    this.getMG2.forEach((item)=> {
      item.displayName = `${item.productCategoryCode}-${item.name}`;
    });
    //
    this.lockmonthForm.patchValue({
      productsubcategory: null
    });
  }

  onMg1Select(selectedsubcat) {
    if (selectedsubcat != null) {
      this.getMG2 = [];
      const productCategoryId = selectedsubcat ? selectedsubcat.map(c => c.id).join(',') : '0';
      if (productCategoryId) {

        this.productcategoryService.getUserMgs(3).subscribe({
          next: (data) => {
            this.getMG2 = data.filter(x => {
              const parentIds = x.parentId.split(',');
              return productCategoryId.split(',').some(id => parentIds.includes(id));
            });
            this.getMG2.forEach((item) => {
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
  

  clearnScreen() {

    this.lockmonthForm.reset();
    this.visible = false;
  }
  searchLockMonth() {

    let formValue = this.lockmonthForm.getRawValue();
    var selectedCustomerIdList = formValue.customer ? formValue.customer.map(c => { return c.customerId }) : [];
    var selectedProductCategoryId1List = formValue.productcategory ? formValue.productcategory.map(c => { return c.id }) : [];
    var selectedProductCategoryId2List = formValue.productsubcategory ? formValue.productsubcategory.map(c => { return c.id }) : [];


    var command = {
      CountryId: "",
      CustomerTypeId: this.f.customerType.value == null ? "" : this.f.customerType.value,
      CustomerId: selectedCustomerIdList ? (selectedCustomerIdList.length > 0 ? selectedCustomerIdList : []): [],  
      ProductCategoryId: selectedProductCategoryId1List ? (selectedProductCategoryId1List.length > 0 ? selectedProductCategoryId1List : []): [],
      ProductSubCategoryId: selectedProductCategoryId2List ? (selectedProductCategoryId2List.length > 0 ? selectedProductCategoryId2List : []): [],
    }
    this.ocoLockMonthGrid = this.directService.getOCOLockCurrentMonth(command);
    this.visible = true
  }
  Updateocolockmonth() {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure ?',
      html: 'Are you sure you want to confirm of o-lock month?',
      showCancelButton: true,
      confirmButtonColor: '#7367f0',
      cancelButtonColor: '#f5334f',
      confirmButtonText: 'Yes',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {

        var commandValue = this.selectedRows.map(el => {
          return {
            SalesEntryPriceQuantityId: el.salesEntryPriceQuantityId,
            SalesEntryId: el.salesEntryId,
            OldSaleEntryHeaderId: el.oldSaleEntryHeaderId,
            OldPriceQtyId: el.oldPriceQtyId,
            OldSaleEntryId: el.oldSaleEntryId,
          }
        });
        if (commandValue.length > 0) {
          this.directService.updatelockcurrentMonth(commandValue).subscribe(s => {
            if (s.isSuccess) {
              Swal.fire('Success', "O-lock month order confirmed successfully", 'success');
              this.dataGrid.instance.refresh();
            }
            else {
              Swal.fire('Error', s.Message, 'error');
            }
          });
        }
        else {
          Swal.fire('Error', "Please select at least one option", 'error');
        }
      }
    })

  }
}
