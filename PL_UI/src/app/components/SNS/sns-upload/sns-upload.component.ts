import { Component, OnInit ,ViewChild} from '@angular/core';
import { Customer } from 'src/app/shared/models/customer.model';
import { MasterserviceService } from '../../masters/masterservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnsService } from '../sns.service';
import Swal from 'sweetalert2';
import {  Observable,  Subject } from 'rxjs';
import { SNSUploadResult } from 'src/app/shared/models/sns-upload-result.model';
import { UserblockService } from 'src/app/shared/services/userblock.service';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import { ActivatedRoute } from '@angular/router';
import { ErrorMsg} from 'src/app/shared/helpers/constants';
@Component({
  selector: 'app-sns-upload',
  templateUrl: './sns-upload.component.html',
  styleUrls: ['./sns-upload.component.scss']
})
export class SnsUploadComponent implements OnInit {
  @ViewChild(UserlockComponent,{static:false} ) lock: UserlockComponent ; 

  loading: boolean = false;
  loading1: boolean = false;
  files: File[] = [];
  rejectedFile: File[] = [];
  submitted = false;
  excelLoading = false;
  uploadForm: FormGroup;
  customerList: Customer[] = [];
  showError: boolean = false;
  minLengthTerm = 2;
  accountList: any;
  accountList$: Observable<any>;
  accountSearch$ = new Subject<string>();
  accountLoading: boolean = false;
  missingItems: SNSUploadResult[] = [];
  negativeInventoryItems: SNSUploadResult[] = [];
  duplicateItems: SNSUploadResult[] = [];
  otherErrors: SNSUploadResult[] = [];
  selectedTabIndex: number = 0;
  checkBlock: any;
  constructor(private readonly masterService: MasterserviceService,
    private formBuilder: FormBuilder, private readonly snsservice: SnsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showError = false;
    this.creatForm();
    this.BindAccountList();
  }

  creatForm() {
    this.uploadForm = this.formBuilder.group({
      oacAccountId: new FormControl(null, [Validators.required]),
      saleSubType: new FormControl('Monthly', [Validators.required]),

    });
  }

  get form() { return this.uploadForm.controls; }


  onRemove(event: any) {
    //this.files.splice(this.files.indexOf(event), 1);
  }

  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
   
  }


  clearAllErrors() {
    this.showError = false;
    this.missingItems = [];
    this.negativeInventoryItems = [];
    this.duplicateItems = [];
    this.otherErrors = [];
  }
  onRunPriceProcess()
  {
    this.loading1 = true;
    const formValue = this.uploadForm.getRawValue();
    const accountcode=  this.accountList.find(c => c.accountId === formValue.oacAccountId)?.accountCode
   if(accountcode==null)
   {
    Swal.fire('Error',  "Please select OAC.", 'error');
    this.loading1 = false;
    return;
   }
  
   this.snsservice.rollingInventoryBP(accountcode)
    .pipe()
    .subscribe({
      next: this.handleRunSuccess.bind(this),
      error: this.handleError.bind(this)
    })
    
  }
  handleRunSuccess(data: any) {
    if(data && data.isSuccess)
    {
      Swal.fire('Success',  "Run Price Process BP done successfully.", 'success');
      this.loading1 = false;
      
    }else{
      Swal.fire('Error',data.errors[0] , 'error');
      this.loading1 = false;
    }
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
    formData.append("FolderPath", "sns-files");
    formData.append("File", this.files[0]);
    formData.append("FileTypeId", "1");
    formData.append("OACAccountId", formValue.oacAccountId)
    formData.append("SaleSubType", formValue.saleSubType);
    this.clearAllErrors();
    this.snsservice.uploadSnsData(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      })
 
  }
  handleSuccess(data: any) {
    this.loading = false;
    if (data && data.isSuccess) {
      const responseMessages: SNSUploadResult[] = data.value;
      const successData = responseMessages.find(c=> c.responseCode === '200');

      if(successData){
        this.clearForm();
        Swal.fire('Success', "SNS uploaded successfully with " + successData.responseMessage, 'success');
      }
      else{
        const serverErrorData = responseMessages.find(c=> c.responseCode === '500');
        if(serverErrorData){
          Swal.fire('Error', ErrorMsg, 'error');
          this.files = [];
        }
        else{
          this.showError = true;
          Swal.fire('Error', "Problem occured while uploading SNS Entries, kidly review error message", 'error');
          // this.missingItems = responseMessages.filter(c=> c.responseCode === '107');
          // this.negativeInventoryItems = responseMessages.filter(c=> c.responseCode === '108');
          // this.duplicateItems = responseMessages.filter(c=> c.responseCode === '106');
          // this.otherErrors = responseMessages.filter(c=> c.responseCode !== '200' && c.responseCode !== '500' && c.responseCode !== '104' && c.responseCode !== '106' && c.responseCode !== '108' && c.responseCode !== '107');
          this.missingItems = responseMessages;
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


  clearForm() {
    this.uploadForm.reset();
    this.files = [];
    this.clearAllErrors();
  }

  getCustomeList() {


  }
  BindAccountList() {

    this.masterService.getAccounts().pipe()
      .subscribe(data => {
        

        data.forEach(element => {
          element.displaytext=element.accountCode +'-'+ element.accountName 
        });

        this.accountList = data;
      }

      );

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



}
