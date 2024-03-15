import { Component, OnInit,ViewChild } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer.model';
import { TransmissionService } from '../transmission.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Observable,  Subject } from 'rxjs';
import { AdjustmentUploadResult } from 'src/app/shared/models/adjustment-upload-result.model';
import { ProductcategoryService } from 'src/app/components/masters/productcategory-master/productcategory.service';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import { ActivatedRoute } from '@angular/router';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-dash-upload',
  templateUrl: './dash-upload.component.html',
  styleUrls: ['./dash-upload.component.scss']
})
export class DashUploadComponent implements OnInit {
  checkBlock: any;
  loading: boolean = false;
  files: File[] = [];
  rejectedFile: File[] = [];
  submitted = false;
  excelLoading = false;
  showError: boolean = false;
  showEntryScreen: boolean = false;
  selectedTabIndex: number = 0;
  public isCollapsed8 = false;
  public isClosed8 = false;
  showAddNewButton:boolean=true;
  showOtherButton:boolean=false;
  dashDataList:any;
  dataList: any;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  constructor(
    private readonly transmissionService: TransmissionService,
    private _fBuilder: FormBuilder,
    private readonly productcategoryService: ProductcategoryService,
    private readonly masterService: MasterserviceService,
    private route: ActivatedRoute) { 
      
    }

  ngOnInit(): void {
    this.loadData();
    this.showError = false;
    this.initializeFormControl();
  }
  onRemove(event: any) {
    //this.files.splice(this.files.indexOf(event), 1);
  }
  initializeFormControl() {
   
  }
  backButton(){
    this.reload();
   }
  onAddNewClick($event: boolean) {
    this.showEntryScreen = true;
    this.submitted=false;
    this.showAddNewButton=false;
    this.showOtherButton=true;
  }

  onSearch() {
    this.loading = true;
    this.submitted = true;
    this.loading = false;
    this.files = [];
  }
  loadData() {
    this.dashDataList = this.transmissionService.getDashtransmit();
  }

  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
  }
  clearAllErrors() {
    this.showError = false;
   
  }
  onSubmit() {
    if (this.files.length == 0) {
      Swal.fire('Warning', "Please select excel file to upload", 'warning');
      return;
    }
    if (this.files.length > 0) {

      this.loading = true;
    const formData = new FormData();
    formData.append("FolderPath", "dash-transmit");
    formData.append("File", this.files[0]);
    formData.append("FileTypeId", "1");
    
    this.transmissionService.UploadTransmit(formData)
    .pipe()
    .subscribe({
      next: this.handleSuccess.bind(this),
      error: this.handleError.bind(this)
    });
  }
  }


  reload() {
    this.showAddNewButton=true;
    this.showOtherButton=false;
    this.showEntryScreen = false;
    this.dataList=null;
  }
  handleSuccess(data: any) {
    this.loading = false;
   // this.dataGrid.instance.refresh();
    Swal.fire('Success', "File Uploaded Successfully", 'success');
  
  }

  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
    this.files = [];
  }
  clearForm() {
   
    this.files = [];
    this.clearAllErrors();
  }
 
 
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
}
