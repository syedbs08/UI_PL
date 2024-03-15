import { Component, ElementRef, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from '../masterservice.service';
import { ProductcategoryService } from '../productcategory-master/productcategory.service';

import { DxDataGridModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { X } from '@angular/cdk/keycodes';
import { Observable, Observer, Subscription, filter } from 'rxjs';
@Component({
  selector: 'app-material-master',
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.scss']
})
export class MaterialMasterComponent implements OnInit {
  showTable: boolean = true;
  materialList: any;
  public isCollapsed8 = false;
  public isClosed8 = false;
  getCompanies: any;
  getMG1: any;
  getMG2: any;
  getMG3: any;
  getMG4: any;
  getMG5: any;
  getMG6: any;
  getSuppliers: any;
  getSeaPorts: any;
  getAirPorts: any;
  getCountries: any;
  showEntryScreen: boolean = false;
  showExportButton: boolean = false;
  showAddNewButton: boolean = true;
  showOtherButton: boolean = false;
  isDisable: boolean = false;
  countryIds: any;
  customerMultiSelectSettings: any;
  constructor(private modalService: NgbModal,
    private readonly masterService: MasterserviceService,
    private readonly productcategoryService: ProductcategoryService,
    private _fBuilder: FormBuilder
  ) {
    this.loadData();
    this.loadCompany();
    this.loadMG1();
    this.loadSupplier();
    this.loadAirPort();
    this.loadSeaPort();
    this.loadCountries();

  }

  materialForm: FormGroup;
  loading = false;
  submitted = false;
  excelLoading = false;

  ngOnInit(): void {
    this.initializeFormControl();
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
  loadData() {
    this.materialList = this.masterService.getMaterialList("materialId");
  }
  backButton() {
    this.reload();
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    const numberValue = Number(inputValue);

    if (isNaN(numberValue)) {
      event.target.value = ''; // Clear the input if it's not a number
    }
  }
  get f() { return this.materialForm.controls; }

  initializeFormControl() {
    this.materialForm = this._fBuilder.group({
      MaterialCode: ['', [RxwebValidators.required()]],
      MaterialShortDescription: ['', [RxwebValidators.required()]],
      BarCode:['', [RxwebValidators.required()]],
      InSap: [],
      Weight: [],
      Volume: [],
      CompanyId: ['', [RxwebValidators.required()]],
      ProductCategoryId1: ['', [RxwebValidators.required()]],
      ProductCategoryId2: ['', [RxwebValidators.required()]],
      ProductCategoryId3: ['', [RxwebValidators.required()]],
      ProductCategoryId4: ['', [RxwebValidators.required()]],
      ProductCategoryId5: ['', [RxwebValidators.required()]],
      ProductCategoryId6: ['', [RxwebValidators.required()]],
      SupplierId: ['',],
      SeaPortId: [],
      AirPortId: [],
      IsActive: [true, [RxwebValidators.required()]],
      MaterialId: [0],
      CountryIds: [''],
    });
  }
  private static getOrderDay(rowData) {
    return (new Date(rowData.updateDate)).getDay();
  }
  customizeText(info) {
    if (info.value == true)
      return 'Y';
    else
      return 'N';
  }
  onExportClick($event) {
    this.excelLoading = true;
    this.masterService.downloadExcels("export-material", "materials")
      .subscribe((result: any) => {
        var blob = new Blob([result]);
        let saveAs = require('file-saver');
        saveAs(blob, "materialmaster" + new Date().toTimeString() + ".xlsx");
        this.excelLoading = false;

      });
  }
  loadCountries() {
    this.masterService.countryLookup().pipe()
      .subscribe(s => {
        this.getCountries = s.map(el => {
          return {
            countryName: el.countryCode + "-" + el.countryName,
            countryId: el.countryId,
            id: el.countryId,
            itemName: el.countryCode + '-' + el.countryName
          }
        });
      });
  }
  loadCompany() {
    this.masterService.getCompanies().subscribe(s => {
      this.getCompanies = s.map(m => { return { companyName: m.companyCode + "-" + m.companyName, companyId: m.companyId } })
    });
  }
  loadSupplier() {
    this.masterService.getSuppliers().subscribe(s => {
      this.getSuppliers = s.map(m => { return { supplierName: m.supplierCode + "-" + m.supplierName, supplierId: m.supplierId } })
    });
  }
  loadSeaPort() {
    this.masterService.getSeaPorts().subscribe(s => {
      this.getSeaPorts = s.map(m => { return { seaPortName: m.seaPortCode + "-" + m.seaPortName, seaPortId: m.seaPortId } })
    });
  }
  loadAirPort() {
    this.masterService.getAirPorts().subscribe(s => {
      this.getAirPorts = s.map(m => { return { airPortName: m.airportCode + "-" + m.airPortName, airPortId: m.airPortId } })
    });

  }
  loadMG1() {
    this.productcategoryService.getMgs(1).subscribe
      ({
        next: (data) => {
          this.getMG1 = data;
          this.getMG1.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    this.getMG2 = null;
    this.getMG3 = null;
    this.getMG4 = null;
    this.getMG5 = null;
    this.getMG6 = null;
  }
  loadMg2(mg1Id: number) {
    this.productcategoryService.getMgs(2).subscribe
      ({
        next: (data) => {
          this.getMG2 = data.filter(x => x.parentId.split(',').map(Number).includes(mg1Id));
          this.getMG2.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    this.loadMg4(mg1Id);
    this.loadMg5(mg1Id);
    this.materialForm.patchValue({
      ProductCategoryId2: null,
      ProductCategoryId3: null,
      ProductCategoryId4: null,
      ProductCategoryId5: null,
      ProductCategoryId6: null,
    });
    this.getMG3 = null;
    this.getMG6 = null;
  }
  loadMg3(mg2Id: number) {
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
    this.loadMg6(mg2Id);
    this.materialForm.patchValue({
      ProductCategoryId6: null,
    });
  }
  loadMg4(mg3Id: number) {
    this.productcategoryService.getMgs(4).subscribe
      ({
        next: (data) => {
          this.getMG4 = data.filter(x => x.parentId.split(',').map(Number).includes(mg3Id));
          this.getMG4.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    this.materialForm.patchValue({
      ProductCategoryId4: null,
    });
  }
  loadMg5(mg4Id: number) {
    this.productcategoryService.getMgs(5).subscribe
      ({
        next: (data) => {
          this.getMG5 = data.filter(x => x.parentId.split(',').map(Number).includes(mg4Id));
          this.getMG5.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    this.materialForm.patchValue({
      ProductCategoryId5: null,
    });
  }
  loadMg6(mg5Id: number) {
    this.productcategoryService.getMgs(6).subscribe
      ({
        next: (data) => {
          this.getMG6 = data.filter(x => x.parentId.split(',').map(Number).includes(mg5Id));
          this.getMG6.forEach((item) => {
            item.displayName = `${item.productCategoryCode}-${item.name}`
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    this.materialForm.patchValue({
      ProductCategoryId6: null,
    });
  }
  resetForm() {
    this.materialForm.reset({ MaterialId: 0, IsActive: true });
    this.submitted = false;
    this.loading = false;
    this.showEntryScreen = false;
    this.showTable = true;
  }
  onSubmit() {
    this.submitted = true;
    if (this.materialForm.invalid) {
      return;
    }
    if (Array.isArray(this.f.CountryIds.value)) {
      const CountryIdsArray = this.f.CountryIds.value;
      this.countryIds = CountryIdsArray.map(c => c.countryId);
      // Now you can use the customerIds array as needed
    } else {
      // Handle the case where CountryIds is not an array
    }
    var command = {
      MaterialId: this.f.MaterialId.value,
      CompanyId: this.f.CompanyId.value,
      MaterialCode: this.f.MaterialCode.value,
      MaterialShortDescription: this.f.MaterialShortDescription.value,
      BarCode: this.f.BarCode.value,
      InSap: this.f.InSap.value,
      Weight: this.f.Weight.value,
      Volume: this.f.Volume.value,
      SeaPortId: this.f.SeaPortId.value,
      AirPortId: this.f.AirPortId.value,
      SupplierId: this.f.SupplierId.value,
      ProductCategoryId1: this.f.ProductCategoryId1.value,
      ProductCategoryId2: this.f.ProductCategoryId2.value,
      ProductCategoryId3: this.f.ProductCategoryId3.value,
      ProductCategoryId4: this.f.ProductCategoryId4.value,
      ProductCategoryId5: this.f.ProductCategoryId5.value,
      ProductCategoryId6: this.f.ProductCategoryId6.value,
      IsActive: this.f.IsActive.value,
      //CountryIds: this.f.CountryIds.value,
      CountryIds: this.countryIds
    }
    this.loading = true;
    this.masterService.addUpdateMaterial(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, command.MaterialId),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: number) {
    this.loading = false;
    if (data == 0) {
      Swal.fire('Success', "Material added successfully", 'success');
    }
    else {
      Swal.fire('Success', "Material updated successfully", 'success');
    }
    this.reload();
    this.loadData();
  }
  handleDeleteSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "Material deleted successfully", 'success');
    this.reload();
    this.loadData();
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }
  onAddNewClick($event: boolean) {
    this.isDisable = false;
    this.showEntryScreen = true;
    this.materialForm.reset({ MaterialId: 0, IsActive: true });
    this.submitted = false;
    this.showExportButton = false;
    this.showAddNewButton = false;
    this.showOtherButton = true;
  }

  onMaterialSelect(material) {
    this.isDisable = true;
    this.loadMg2(material.productCategoryId1);
    this.loadMg3(material.productCategoryId2);
    this.materialForm.patchValue({
      MaterialId: material.materialId,
      CompanyId: material.companyId,
      MaterialCode: material.materialCode,
      MaterialShortDescription: material.materialShortDescription,
      BarCode: material.barCode,
      InSap: material.inSap,
      Weight: material.weight,
      Volume: material.volume,
      SeaPortId: material.seaPortId,
      AirPortId: material.airPortId,
      SupplierId: material.supplierId,
      ProductCategoryId1: material.productCategoryId1,
      ProductCategoryId2: material.productCategoryId2,
      ProductCategoryId3: material.productCategoryId3,
      ProductCategoryId4: material.productCategoryId4,
      ProductCategoryId5: material.productCategoryId5,
      ProductCategoryId6: material.productCategoryId6,
      IsActive: material.isActive,
    });
    if (material && material.countryIds) {
      const ids = material.countryIds.split(',').map(Number); // Convert comma-separated string to an array of numbers
      const data = this.getCountries.filter(x => ids.includes(x.id));
      if (data.length > 0) {
        const selectCountryId = data.map(item => ({
          countryName: item.countryName,
          countryId: item.countryId,
          id: item.id,
          itemName: item.itemName
        }));
        this.materialForm.patchValue({
          CountryIds: selectCountryId
        });
      }
    }

    this.showEntryScreen = true;
    this.showExportButton = false;
    this.showAddNewButton = false;
    this.showOtherButton = true;

  }

  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.materialForm.reset({ MaterialId: 0, IsActive: true });
    this.showEntryScreen = false;
    this.showExportButton = false;
    this.showAddNewButton = true;
    this.showOtherButton = false;
  }
}


