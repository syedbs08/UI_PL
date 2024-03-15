import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {SnsService} from '../sns.service';
import { MasterserviceService } from 'src/app/components/masters/masterservice.service';
import { DirectSaleUploadResult } from 'src/app/shared/models/direct-sale-upload-result.model';
import { CurrentMonthName,ErrorMsg} from 'src/app/shared/helpers/constants';
@Component({
  selector: 'app-stock-pricing',
  templateUrl: './stock-pricing.component.html',
  styleUrls: ['./stock-pricing.component.scss']
})
export class StockPricingComponent implements OnInit {

  uploadForm: FormGroup;
  files: File[] = [];
  rejectedFile: File[] = [];
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  public isCollapsedList8 = false;
  public isClosedList8 = false;
  public isCollapsedUpdate8 = false;
  public isClosedUpdate8 = false;
  loading: boolean = false;
  loading1: boolean = false;
  missingItems: DirectSaleUploadResult[] = [];
  negativeInventoryItems: DirectSaleUploadResult[] = [];
  duplicateItems: DirectSaleUploadResult[] = [];
  otherErrors: DirectSaleUploadResult[] = [];
  selectedTabIndex: number = 0;
  showError: boolean = false;
  constructor( private formBuilder: FormBuilder,
    private readonly masterService: MasterserviceService,
    private readonly snsService: SnsService) { }

  ngOnInit(): void {
    this.initializeControls();
  }
  initializeControls()
  {
    this.uploadForm = this.formBuilder.group({
      stockPriceType: new FormControl(null, [Validators.required]),
    });
  }
  get form() { return this.uploadForm.controls; }
  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  clearForm(){
    this.uploadForm.reset();
    this.files = [];
    this.showError=false;
  }
  onSubmit()
  {
    this.submitted==true;
      if(this.uploadForm.invalid)
      {
        this.uploadForm.markAllAsTouched();
        Swal.fire('Warning', "Please fill mandatory fields", 'warning');
        return;
      }
      if (this.files.length == 0) {
        Swal.fire('Warning', "Please select excel file to upload", 'warning');
        return;
      }
      const formValue = this.uploadForm.getRawValue();
      this.loading = true;
      const command = new FormData();
      command.append("FolderPath", "stock-price");
      command.append("File", this.files[0]);
      command.append("StockPriceType", formValue.stockPriceType);
      this.snsService.uploadStockPrice(command).pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: any) {
    this.loading = false;

    if(data && data.isSuccess){
      const responseMessages: DirectSaleUploadResult[] = data.value;

      const successData = responseMessages.find(c=> c.responseCode === '200');
      if(successData){
        this.clearForm();
        if(responseMessages.filter(c=> c.responseCode === '107'))
        {
          this.showError = true;
          this.missingItems = responseMessages.filter(c=> c.responseCode === '107');
          this.negativeInventoryItems = responseMessages.filter(c=> c.responseCode === '108');
          this.duplicateItems = responseMessages.filter(c=> c.responseCode === '106');
          this.otherErrors = responseMessages.filter(c=> c.responseCode !== '200' && c.responseCode !== '500' && c.responseCode !== '104' && c.responseCode !== '106' && c.responseCode !== '108' && c.responseCode !== '107');
        }
        Swal.fire('Success', "Stock Pricing uploaded successfully with " + successData.responseMessage, 'success');
      }
      else{
        const serverErrorData = responseMessages.find(c=> c.responseCode === '500');
        if(serverErrorData){
          Swal.fire('Error', ErrorMsg, 'error');
          this.files = [];
        }
        else{
          this.showError = true;
          Swal.fire('Error', "Problem occured while uploading Stock Pricing , kindly review error message", 'error');
          this.missingItems = responseMessages.filter(c=> c.responseCode === '107');
          this.negativeInventoryItems = responseMessages.filter(c=> c.responseCode === '108');
          this.duplicateItems = responseMessages.filter(c=> c.responseCode === '106');
          this.otherErrors = responseMessages.filter(c=> c.responseCode !== '200' && c.responseCode !== '500' && c.responseCode !== '104' && c.responseCode !== '106' && c.responseCode !== '108' && c.responseCode !== '107');
        }
      }
    }
    else{
      Swal.fire('Error', ErrorMsg, 'error');
      this.files = [];
    }
  }
  onRunPriceProcess()
  {
    this.loadCurrentMonth();
    this.submitted==true;
   
  }
  loadCurrentMonth()
  {
   this.masterService.getGlobalConfigByKey(CurrentMonthName)
   .pipe()
   .subscribe({
     next: this.getCurrentMonthdata.bind(this),
     error: this.handleError.bind(this)
   });
  }
  getCurrentMonthdata(data) {
    this.snsService.runPriceProcess(data) 
    .pipe()
   .subscribe({
     next: this.handleRunPriceProcessSuccess.bind(this),
     error: this.handleError.bind(this)
   });
  }
  handleRunPriceProcessSuccess(data) {
   Swal.fire('Success', "Run Price Process done successfully", 'success');
  }
  handleError(error: any) {
    Swal.fire('Error', ErrorMsg, 'error');
    this.loading = false;
    this.files = [];
  }
  setSelectedTab(){
    if(this.missingItems.length)
      this.selectedTabIndex = 0;
    if(this.negativeInventoryItems.length)
      this.selectedTabIndex = 1;
    if(this.duplicateItems.length)
      this.selectedTabIndex = 2;
    if(this.otherErrors.length)
      this.selectedTabIndex = 3;
  }

  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
}
