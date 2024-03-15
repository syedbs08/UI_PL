import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterserviceService } from '../../masters/masterservice.service';
import { CustomerType } from 'src/app/shared/models/customer-type.model';
import { Customer } from 'src/app/shared/models/customer.model';
import { ProductCategory } from 'src/app/shared/models/product-category.model';
import Swal from 'sweetalert2';
import { DirectsalesService } from '../directsales.service';
import { CustomerTypeList } from 'src/app/shared/data/common/customer-type';
import { ProductcategoryService } from '../../masters/productcategory-master/productcategory.service';
import { DirectSaleUploadResult } from 'src/app/shared/models/direct-sale-upload-result.model';
import { ActivatedRoute } from '@angular/router';
import { UserblockService } from 'src/app/shared/services/userblock.service';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import { ErrorMsg} from 'src/app/shared/helpers/constants';
@Component({
  selector: 'app-direct-sales-upload',
  templateUrl: './direct-sales-upload.component.html',
  styleUrls: ['./direct-sales-upload.component.scss'],

})
export class DirectSalesUploadComponent implements OnInit {
  @ViewChild(UserlockComponent, { static: false }) lock: UserlockComponent;
  pivotFields: any[];
  @Input() showheader = true;
  uploadForm: FormGroup;
  submitted: boolean = false;
  customerTypeList: CustomerType[] = CustomerTypeList;
  customerList: Customer[] = [];
  productCategoryList: ProductCategory[] = [];
  productSubCategoryList: ProductCategory[] = [];
  loading: boolean = false;
  files: File[] = [];
  rejectedFile: File[] = [];
  missingItems: DirectSaleUploadResult[] = [];
  negativeInventoryItems: DirectSaleUploadResult[] = [];
  duplicateItems: DirectSaleUploadResult[] = [];
  otherErrors: DirectSaleUploadResult[] = [];
  showError: boolean = false;
  showReport: boolean = false;
  selectedTabIndex: number = 0;
  checkBlock: any;
  dataSource: any;
  constructor(private readonly masterService: MasterserviceService,
    private formBuilder: FormBuilder,
    private readonly directsalesService: DirectsalesService,
    private readonly productcategoryService: ProductcategoryService,
    private userBlockService: UserblockService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.creatForm();
    this.getProductCategoryList();
  }

  creatForm() {
    this.uploadForm = this.formBuilder.group({
      customerType: new FormControl(null, [Validators.required]),
      customerId: new FormControl(null, [Validators.required]),
      productCategoryId: new FormControl(null, [Validators.required]),
      productSubCategoryId: new FormControl(null),
      saleSubType: new FormControl('Monthly', [Validators.required]),
      //product:new FormControl('Sub Group', [Validators.required]),
    });
  }

  get form() { return this.uploadForm.controls; }

  onCustomerTypeChange() {
    this.customerList = [];
    this.uploadForm.get('customerId')?.setValue(null);
    if (this.uploadForm.getRawValue().customerType) {
      this.getCustomerList(this.uploadForm.getRawValue().customerType == 1);
    }
  }

  getCustomerList(isCollabo: boolean) {
    this.masterService.getCollaboNonCollaboCustomersByUserCountryIds(isCollabo, null, "Direct").subscribe({
      next: (data) => {
        this.customerList = data.map(el => { return { customerId: el.customerId, customerName: el.customerCode + '-' + el.customerName } });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getProductCategoryList() {
    this.productcategoryService.getUserMgs(2).subscribe({
      next: (data) => {
        this.productCategoryList = data;
        this.productCategoryList.forEach((item) => {
          item.displayName = `${item.productCategoryCode}-${item.name}`;
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.productSubCategoryList = [];
  }
  getProductSubCategoryList() {
    this.productSubCategoryList = [];
    this.uploadForm.get('productSubCategoryId')?.setValue(null);
    const productCategoryId = this.uploadForm.getRawValue().productCategoryId;
    if (productCategoryId) {
      this.productcategoryService.getUserMgs(3).subscribe({
        next: (data) => {
          this.productSubCategoryList = data.filter(x => x.parentId.split(',').map(Number).includes(productCategoryId));
          this.productSubCategoryList.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`;
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  clearForm() {
    this.uploadForm.reset();
    this.files = [];

  }

  onSubmit() {
    if (!this.uploadForm.valid) {
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    if (this.files.length == 0) {
      Swal.fire('Warning', "Please select excel file to upload", 'warning');
      return;
    }
    const formValue = this.uploadForm.getRawValue();
    this.loading = true;
    const formData = new FormData();
    formData.append("FolderPath", "direct-sales");
    formData.append("File", this.files[0]);
    formData.append("FileTypeId", "1");
    formData.append("CustomerType", formValue.customerType);
    formData.append("CustomerId", formValue.customerId);
    formData.append("ProductCategoryId", formValue.productCategoryId);
    formData.append("ProductSubCategoryId", formValue.productSubCategoryId);
    formData.append("SaleSubType", formValue.saleSubType);
    //formData.append("Product", formValue.product);
    

    this.clearAllErrors();
    this.directsalesService.uploadAgentDirectSale(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }

  clearAllErrors() {
    this.showError = false;
    this.showReport = false;
    this.missingItems = [];
    this.negativeInventoryItems = [];
    this.duplicateItems = [];
    this.otherErrors = [];
  }
  loadReport() {
    const formValue = this.uploadForm.getRawValue();
    const formData = new FormData();
    formData.append("CustomerId", formValue.customerId);
    formData.append("ProductCategoryId", formValue.productCategoryId);
    formData.append("ProductSubCategoryId", formValue.productSubCategoryId);
    formData.append("SaleSubType", formValue.saleSubType);
   this.files = [];
    this.showReport = true;
    this.directsalesService.getDirectSaleReport(formData).subscribe({
      next: (data) => {
        this.loading = false;
        if (data.isSuccess) {
          this.dataSource = {
            fields: [
              {
                caption: 'Consignee',
                width: 120,
                dataField: 'consignee',
                area: 'row',
              },
              {
                caption: 'Item_Code',
                width: 120,
                dataField: 'item_Code',
                area: 'row',
              },
              {
                dataField: 'monthYear',
                area: 'column',
              },
              {
                caption: 'Order Qty',
                dataField: 'orderQty',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data',
              },
              {
                caption: 'Purchase Qty',
                dataField: 'purchaseQty',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data',
              },

              {
                caption: 'Sale Qty',
                dataField: 'saleQty',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data',
              },

              {
                caption: 'Inventory Qty',
                dataField: 'inventoryQty',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data',
              },
              {
                caption: 'MPO Qty',
                dataField: 'mpoQty',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data',
               
              },
              {
                caption: 'Adj Qty',
                dataField: 'adjQty',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data',
              },


            ],
            store: data.value,
          };
        }
       
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
        //Swal.fire('Error', ErrorMsg, 'error');
      }
    });
  }
  handleSuccess(data: any) {
    this.loading = false;
    if (data && data.isSuccess) {
      const responseMessages: DirectSaleUploadResult[] = data.value;
      const successData = responseMessages.find(c => c.responseCode === '200');
      if (successData) {
        
        this.showReport = true;
        Swal.fire('Success', "Direct Sales uploaded successfully with " + successData.responseMessage, 'success');
        this.loadReport();

      }
      else {
        const serverErrorData = responseMessages.find(c => c.responseCode === '500');
        if (serverErrorData) {
          Swal.fire('Error', ErrorMsg, 'error');
          this.files = [];
        }
        else {
          this.showError = true;
          this.showReport = false;
          Swal.fire('Error', "Problem occured while uploading Direct Sales , kindly review error message", 'error');
          this.missingItems = responseMessages.filter(c => c.responseCode === '104');
          this.negativeInventoryItems = responseMessages.filter(c => c.responseCode === '108');
          this.duplicateItems = responseMessages.filter(c => c.responseCode === '106');
          this.otherErrors = responseMessages.filter(c => c.responseCode !== '200' && c.responseCode !== '500' && c.responseCode !== '104' && c.responseCode !== '106' && c.responseCode !== '108');
          this.setSelectedTab();
        }
      }
    }
    else {
      Swal.fire('Error', ErrorMsg, 'error');
      this.files = [];
    }
  }

  handleError(error: any) {
    Swal.fire('Error', ErrorMsg, 'error');
    this.loading = false;
    this.files = [];
  }

  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  setSelectedTab() {
    if (this.missingItems.length)
      this.selectedTabIndex = 0;
    if (this.negativeInventoryItems.length)
      this.selectedTabIndex = 1;
    if (this.duplicateItems.length)
      this.selectedTabIndex = 2;
    if (this.otherErrors.length)
      this.selectedTabIndex = 3;
  }

}
