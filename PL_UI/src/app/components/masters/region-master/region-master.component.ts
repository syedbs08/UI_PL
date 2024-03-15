import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray,FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from '../masterservice.service';
import { DxDataGridModule } from 'devextreme-angular';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-region-master',
  templateUrl: './region-master.component.html',
  styleUrls: ['./region-master.component.scss']
})
export class RegionMasterComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  showTable: boolean = true;
 regionList: any;
 grid:any;
 public isCollapsed8 = false;
 public isClosed8 = false;
 @ViewChild('regionEntryModal') regionEntryModal: ElementRef;
 constructor(private modalService: NgbModal,
   private readonly masterService: MasterserviceService,
   private _fBuilder: FormBuilder,
   private cdr: ChangeDetectorRef
  ) {  
    
  }
 regionForm: FormGroup;
 loading = false;
 submitted = false;
 excelLoading = false;
 ngOnInit(): void {
   this.initializeFormControl();
   this.loadData();
 }
 loadData(){
  this.regionList = this.masterService.getRegionList();
 }

 customizeText(info){  
  if(info.value==true)
  return 'Y'  ;
  else
  return 'N';
} 
 onExportClick($event) {
  this.excelLoading = true;
  this.masterService.downloadExcels("export-region", "regions")
    .subscribe((result: any) => {
      var blob = new Blob([result]);
      let saveAs = require('file-saver');
      saveAs(blob, "regionmaster"+new Date().toTimeString()+".xlsx");
      this.excelLoading=false;

    });
}
 get f() { return this.regionForm.controls; }
 initializeFormControl() {
   this.regionForm = this._fBuilder.group({
     RegionCode: ['', [RxwebValidators.required()]],
     RegionName: ['', [RxwebValidators.required()]],
     RegionShortDescription: ['', [RxwebValidators.required()]],
     IsActive: [true, [RxwebValidators.required()]],
     RegionId: [0]

   });
 }
  onSubmit() {
   this.submitted = true;
   if (this.regionForm.invalid) {
     return;
   }
   var command = {
     RegionId: this.f.RegionId.value,
     RegionName: this.f.RegionName.value,
     RegionCode: this.f.RegionCode.value,
     RegionShortDescription: this.f.RegionShortDescription.value,
     IsActive: this.f.IsActive.value
   }
   this.loading = true;
   this.masterService.addUpdateRegion(command)
     .pipe()
     .subscribe({
       next: this.handleSuccess.bind(this,command.RegionId),
       error: this.handleError.bind(this)
     });
 }
 handleSuccess(data: number) {
   this.loading = false;
   if(data==0)
   {
    Swal.fire('Success', "Region added successfully", 'success');
   }
  else{
    Swal.fire('Success', "Region updated successfully", 'success');
  }
   this.onClosePopUp();
   this.reload()
 }
handleDeleteSuccess(data: any) {
  this.loading = false;
  Swal.fire('Success', "Region deleted successfully", 'success');
  this.reload();
}
 handleError(error: any) {
   Swal.fire('Error', error.Message, 'error');
   this.loading = false;

 }
  //events
  onAddNewClick($event: boolean) {
    this.resetForm();
    if ($event) {
      this.modalService.open(this.regionEntryModal,{backdrop : 'static'});
    }

  }
  onRegionSelect(region) {  
    this.regionForm.patchValue({
      RegionId:region.regionId,
      RegionCode: region.regionCode,
      RegionName: region.regionName,
      RegionShortDescription: region.regionShortDescription,
      IsActive: region.isActive
    });
    this.modalService.open(this.regionEntryModal,{backdrop : 'static'});
  }
  onRegionSelectDelete(region){
  
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
    this.masterService.regionDelete(region.regionId)
     .pipe()
     .subscribe({
       next: this.handleDeleteSuccess.bind(this),
       error: this.handleError.bind(this)
      });
    }
  })
}
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  resetForm()
  {
    this.regionForm.reset({ RegionId: 0, IsActive: true });
    this.submitted = false;
    this.loading=false;
  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.loadData();
    this.regionForm.reset();
  }
  onClosePopUp() {
    this.resetForm();   
    this.modalService.dismissAll('Close click');
  }

}

