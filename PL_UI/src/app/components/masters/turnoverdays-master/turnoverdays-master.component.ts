import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MasterserviceService } from '../masterservice.service';
import Swal from 'sweetalert2';
import { Renderer2 } from '@angular/core'
@Component({
  selector: 'app-turnoverdays-master',
  templateUrl: './turnoverdays-master.component.html',
  styleUrls: ['./turnoverdays-master.component.scss']
})
export class TurnoverdaysMasterComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  showTable: boolean = true;
  turnoverdaysList: any;
  files: File[] = [];
  rejectedFile: File[] = [];
  public isCollapsed8 = false;
  public isClosed8 = false;

  error: string = "";
  @ViewChild('turnoverdaysEntryModal') turnoverdaysEntryModal: ElementRef;
  constructor(private modalService: NgbModal,
    private readonly masterService: MasterserviceService,
    private renderer: Renderer2
  ) {
   this.loadData();
  }
  loading = false;
  excelLoading=false;
  submitted = false;
  ngOnInit(): void {
  }
  loadData(){
    this.turnoverdaysList = this.masterService.getTurnoverdaysList();
  }
  downloadTemplate($event: any) {
    if ($event) {
      window.location.href = 'assets/content/TurnoverDays_Master.xlsx';
    }
  }
 
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  // dropzone


  onFilesRejected(event) {
    console.log(event);
  }
  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  onAddNewClick($event: any) {
    this.error = "";
    this.files = [];
    if ($event) {
      this.modalService.open(this.turnoverdaysEntryModal, { backdrop: 'static' });
    }


  }
  onSubmit() {
    this.error = "";
    if (this.files.length == 0) {

      Swal.fire('Warning', "Please select excel file to upload", 'warning');
      return;
    }
    if (this.files.length > 0) {

      this.loading = true;
      const formData = new FormData();
      formData.append("FolderPath", "turnoverdays");
      formData.append("File", this.files[0]);
      formData.append("FileTypeId", "1");

      this.masterService.UploadTurnoverdays(formData)
        .pipe()
        .subscribe({
          next: this.handleSuccess.bind(this),
          error: this.handleError.bind(this)
        });


    }

  }
  handleSuccess(data: any) {
    this.loading = false;
    this.reload();
    Swal.fire('Success', "Turnoverdays uploaded successfully", 'success');

  }
  handleError(error: any) {
    Swal.fire('Error', "Problem occured while uploading turnoverdays , kidly review error message", 'error');
    this.error = error.Message;
    this.loading = false;
  }

  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.loadData();
    this.modalService.dismissAll('Close click');
  }

  onExportClick($event) {
    this.excelLoading = true;
    this.masterService.downloadExcels("export-turnoverdays", "turnoverdays")
      .subscribe((result: any) => {
        var blob = new Blob([result]);
        let saveAs = require('file-saver');
        saveAs(blob, "turnoverdaysmaster"+new Date().toTimeString()+".xlsx");
        this.excelLoading=false;

      });
  }
}


