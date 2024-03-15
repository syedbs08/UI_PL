import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { de } from 'date-fns/locale';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: 'app-assignuserproduct',
  templateUrl: './assignuserproduct.component.html',
  styleUrls: ['./assignuserproduct.component.scss']
})
export class AssignuserproductComponent implements OnInit {
  @Input() userObjectId: any;
  @Output() totalProduct = new EventEmitter<string>();
  userProductMappingForm: FormGroup;
  loading = false;
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  newEntry = false;
  showTable: boolean = true;
  userProductList: any;
  userproductMapping: any;
  roles:any;
  customerMultiSelectSettings:any;
  @ViewChild('assignProductModal') assignProductModal: ElementRef;
  constructor(private _fBuilder: FormBuilder,
    private readonly masterService: MasterserviceService,
    private modalService: NgbModal,
    private authService: MsalService,
    private location: Location) {

  }

  ngOnInit(): void {
    this.loadUserDepartmentMapping();
    this.initializeFormControl();
    this.loadProduct();
   
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
  get f() { return this.userProductMappingForm.controls; }
  initializeFormControl() {
    this.userProductMappingForm = this._fBuilder.group({
      products: [[], [RxwebValidators.required]],
      userlId: [this.userObjectId],
      existingproducts: []
    })
  }
  loadUserDepartmentMapping() {
    this.masterService.getuserProductMapping(this.userObjectId)
      .subscribe((resp) => {
        // this.userproductMapping = resp;
        this.userproductMapping = resp.map(el => {
          return {
            productCode: el.productCode,
            productName:el.productName,
            id: el.productId,
            itemName: el.productName ,
            
          }
        })
        this.totalProduct.emit(this.userproductMapping.length);
      });
  }
  loadProduct() {
      this.masterService.getMG1Lookup()
      .pipe()
      .subscribe({
        next: (x) => (
          this.userProductList = x.map(el => { return { 
            id: el.id, 
            name: el.productCategoryCode + '-' + el.name ,
            itemName:el.productCategoryCode + '-' + el.name ,
          } })
        ),
        error: (x) => (console.log(x))
      });
  }
  onBackClick($event: boolean) {
    this.location.back();
  }
  onClosePopUp() {
    this.userProductMappingForm.reset();
  }
  onSubmit() {
    this.submitted = true;
    if (this.userProductMappingForm.invalid) {
      return;
    }
    this.loading=true;
    var products: any[] = [];
    var deleteProducts: any[] = [];
    if (this.f.existingproducts.value != null) {
      deleteProducts = this.f.existingproducts.value.filter((el) => {
        return !this.f.products.value.some((f) => {
          return el === f
        });
      });
      products = this.f.products.value.filter((d) => {
        return !this.f.existingproducts.value.some((f) => {
          return d === f.id
        })
      });
    }
    else {
      products = this.f.products.value;
    }
    if (products.length == 0 && deleteProducts.length == 0) {
      Swal.fire('Warning', "You have not assign any product to user for add or delete", 'warning');
      this.loading=false;
      return;
    }
    var command =
    {
      userId: this.userObjectId,
      productIdId:  products.map(a => a.id),
      deletedProductId: deleteProducts.map(a => a.id)
    }
    if (deleteProducts.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure ?',
        html: 'you have selected   <span style="font-size:12px; color:#f5334f;">' + deleteProducts.map(a => a.name).join(', ') + '</span> product to be removed !',
        showCancelButton: true,
        confirmButtonColor: '#7367f0',
        cancelButtonColor: '#f5334f',
        confirmButtonText: 'Yes',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitData(command);
        }
      })
    }
    else {
      this.submitData(command);
    }
  }
  submitData(command) {
    this.masterService
      .adduserproducttMapping(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "User department mapping successfully done", 'success');
    this.modalService.dismissAll('Close click');
    this.reload();
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.loadUserDepartmentMapping();
      this.showTable = true;
    }, 0);
    this.modalService.dismissAll('Close click');
  }
  onAddNewClick(event: any) {
    if (this.userproductMapping.length > 0) {
      const selectProductId = this.userproductMapping.map(item => {
        const container = {};
        container["id"] = item.id;
        container["name"] = item.productName;
        container["itemName"] = item.productName;
        return container;
      });

      this.userProductMappingForm.patchValue({
        products: selectProductId,
        existingproducts: selectProductId
      })
    }
    this.modalService.open(this.assignProductModal);
    this.newEntry = true;
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
}
