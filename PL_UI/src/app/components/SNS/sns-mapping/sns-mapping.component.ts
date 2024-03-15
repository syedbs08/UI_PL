import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { de } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { MasterserviceService } from '../../masters/masterservice.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ProductcategoryService } from '../../masters/productcategory-master/productcategory.service';
import { SnsService } from '../sns.service';
@Component({
  selector: 'app-sns-mapping',
  templateUrl: './sns-mapping.component.html',
  styleUrls: ['./sns-mapping.component.scss']
})
export class SnsMappingComponent implements OnInit {

  @ViewChild('snsmappingEntryPopup') snsmappingEntryPopup: ElementRef;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  snsmappingForm: FormGroup;
  snsmapForm:FormGroup;
  loading = false;
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  dtOptions: DataTables.Settings = {};
  accountList: any;
  fromMaterialList: any;
  toMaterialList: any
  showTable: boolean = true;
  showEntryScreen: boolean = true;
  snsMappingSelect: any;
  multiSelectSettings = {};
  productSubCategoryList: any;
  productCategoryList: any;
  data: any;
  account:any;
  snsmappingFileName = "SNS_MAPPING_" + new Date().toDateString();
  constructor(private modalService: NgbModal,
    private readonly masterService: MasterserviceService,
    private readonly productcategoryService: ProductcategoryService,
    private readonly snsService: SnsService,
    private _fBuilder: FormBuilder,) {
      this.bindAccountList();
      this.loadData();
      

  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.multiSelectSettings = {
      singleSelection: false,
      placeHolder: "Select customers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      autoPosition: false,
      maxHeight: '200',
      badgeShowLimit: 1
    };
    
    this.getProductCategoryList();
   
  }

  get f() { return this.snsmappingForm.controls; }
  get mapf() { return this.snsmapForm.controls; }
  
  loadData() {
    this.data = this.snsService.getSNSmappingList();
  }
  initializeFormControl() {
    this.snsmappingForm = this._fBuilder.group({
      AccountCode: ['', [RxwebValidators.required()]],
      FromModel: ['', [RxwebValidators.required()]],
      ToModel: ['', [RxwebValidators.required()]],
      MG2: [''],
      MG3: [''],
      IsActive: [true],
      SNS_MappingId: [0]
    });
    this.snsmapForm = this._fBuilder.group({
      AccountCode: [, [RxwebValidators.required()]],
    });
  }

  onProductSubCategoryChange() {
    let formValue = this.snsmappingForm.getRawValue();
    this.masterService.getMaterialByMG1MG2(formValue.MG2,formValue.MG3).subscribe({
      next: (data) => {
        this.fromMaterialList =
          data.map(el => {
            return {
              id: el.materialId,
              itemName: el.materialCode,
              materialCode: el.materialCode,
              materialId: el.materialId
            }
          });
      },
      error: (error) => {
        console.log(error);
      }

    });
    this.masterService.getMaterialByMG1MG2(formValue.MG2,0).subscribe({
      next: (data) => {
        this.toMaterialList =
          data.map(el => {
            return {
              id: el.materialId,
              itemName: el.materialCode,
              materialCode: el.materialCode,
              materialId: el.materialId
            }
          });
      },
      error: (error) => {
        console.log(error);
      }

    });
  }

  bindAccountList() {
    this.masterService.getAccounts()
    .subscribe({
      next: (data) => {
        this.accountList = data;
        this.accountList.forEach((item) => {
          item.displayName = `${item.accountCode}-${item.accountName}`;
        });
        this.account = data;
        this.account.forEach((item) => {
          item.displayName = `${item.accountCode}-${item.accountName}`;
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
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
  loadMg3(mg2Id: number) {
    this.productcategoryService.getMgs(3).subscribe
      ({
        next: (data) => {
          this.productSubCategoryList = data.filter(x => x.parentId.split(',').map(Number).includes(mg2Id));
          this.productSubCategoryList.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    // this.materialForm.patchValue({
    //   ProductCategoryId4: null,
    // });
  }

  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }

  onMap() {
    this.submitted = true;
    if (this.snsmapForm.invalid) {
      return;
    }
    this.loading = true;
    this.snsService.addSnsMapping(this.mapf.AccountCode.value)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, this.mapf.AccountCode.value),
        error: this.handleError.bind(this)
      })
  }
  onSubmit() {
    this.submitted = true;

    if (this.snsmappingForm.invalid) {
      return;
    }
    let formValue = this.snsmappingForm.getRawValue();

    var command = {
      SNS_MappingId: this.f.SNS_MappingId.value,
      AccountCode: this.f.AccountCode.value,
      FromModel: this.f.FromModel.value,
      ToModel: this.f.ToModel.value,
      IsActive: this.f.IsActive.value,
      IsDeleted: false
    }
    this.loading = true;
    this.snsService.addDeleteSnsMapping(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, command.SNS_MappingId),
        error: this.handleError.bind(this)
      })
  }
  onSNSmappingSelect(data) {
    this.loadMg3(data.mG2);
    this.snsMappingSelect = data;
    this.snsmappingForm.patchValue({
      SNS_MappingId: data.snS_MappingId,
      AccountCode: data.accountCode,
      MG2: data.mG2,
      MG3: data.mG3,
      FromModel: data.fromModel,
      ToModel: data.toModel,
      IsActive: data.isActive,
    });
    //this.onProductSubCategoryChange();
    this.modalService.open(this.snsmappingEntryPopup, { backdrop: 'static' });
  }
  handleSuccess(data: number) {
    this.loading = false;
    if (data == 0) {
      Swal.fire('Success', "SNS mapping added successfully", 'success');
      this.reload();
      this.resetForm();
    }
    else {
      Swal.fire('Success', "Model map successfully", 'success');
      this.snsmapForm.reset();
    }
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  resetForm() {
    this.snsmappingForm.reset({ SNS_MappingId: 0, IsActive: true });
    this.submitted = false;
    this.loading = false;
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.snsmappingForm.reset();
    this.modalService.dismissAll('Close click');
    this.dataGrid.instance.refresh();
  }
  openPopUp(popUpId) {
    this.modalService.open(popUpId, { backdrop: 'static' });
  }
  onAddNewClick(event: any) {
    this.resetForm();
    if (event == true) {
      this.modalService.open(this.snsmappingEntryPopup, { backdrop: 'static' });
    }
  }
  onSNSmappingSelectDelete(data) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure ?',
      html: 'Are you sure you want to delete this record?',
      showCancelButton: true,
      confirmButtonColor: '#7367f0',
      cancelButtonColor: '#f5334f',
      confirmButtonText: 'Yes',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        var command = {
          SNS_MappingId: data.snS_MappingId,
          AccountCode: data.accountCode,
          FromModel: data.fromModel,
          ToModel: data.toModel,
          IsActive: data.isActive,
          IsDeleted: true
        }
        this.snsService.addDeleteSnsMapping(command)
          .pipe()
          .subscribe({
            next: this.handleDeleteSuccess.bind(this),
            error: this.handleError.bind(this)
          })

      }
    })
  }
  handleDeleteSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "SNS mapping deleted successfully", 'success');
    this.reload();
  }
  customizeText(info) {
    if (info.value == true)
      return 'Y';
    else
      return 'N';
  }
}
