import { Component, Input, OnInit,ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DirectsalesService } from '../directsales.service';
import { DirectSaleUploadResult } from 'src/app/shared/models/direct-sale-upload-result.model';
import { ActivatedRoute } from '@angular/router';
import { UserblockService } from 'src/app/shared/services/userblock.service';
import { UserlockComponent } from 'src/app/shared/components/userlock/userlock.component';
import { ErrorMsg} from 'src/app/shared/helpers/constants';
@Component({
  selector: 'app-ssd-forecast-upload',
  templateUrl: './ssd-forecast-upload.component.html',
  styleUrls: ['./ssd-forecast-upload.component.scss']
})
export class SsdForecastUploadComponent implements OnInit {
  @ViewChild(UserlockComponent,{static:false} ) lock: UserlockComponent ; 
  checkBlock: any;
  @Input() showheader=true;
  submitted: boolean = false;
  files: File[] = [];
  rejectedFile: File[] = [];
  loading: boolean = false;
  showError: boolean = false;
  selectedTabIndex: number = 0;
  missingItems: DirectSaleUploadResult[] = [];
  duplicateItems: DirectSaleUploadResult[] = [];
  otherErrors: DirectSaleUploadResult[] = [];

  constructor(private readonly directsalesService: DirectsalesService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  
  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.rejectedFile.push(...event.rejectedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  clearForm(){
    this.files = [];
  }

  onSubmit(){
    if (this.files.length == 0) {
      Swal.fire('Warning', "Please select excel file to upload", 'warning');
      return;
    }
    this.loading = true;
    const formData = new FormData();
    formData.append("FolderPath", "ssd-forecast");
    formData.append("File", this.files[0]);
    formData.append("FileTypeId", "1");
    this.clearAllErrors();
    this.directsalesService.uploadSSDForecast(formData)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }

  clearAllErrors(){
    this.showError = false;
    this.missingItems = [];
    this.duplicateItems = [];
    this.otherErrors = [];
  }

  handleSuccess(data: any) {
    this.loading = false;
    if(data && data.isSuccess){
      const responseMessages: DirectSaleUploadResult[] = data.value;
      const successData = responseMessages.find(c=> c.responseCode === '200');
      if(successData){
        this.clearForm();
        Swal.fire('Success', "SSD Forecast uploaded successfully with " + successData.responseMessage, 'success');
      }
      else{
        const serverErrorData = responseMessages.find(c=> c.responseCode === '500');
        if(serverErrorData){
          Swal.fire('Error', ErrorMsg, 'error');
          this.files = [];
        }
        else{
          this.showError = true;
          Swal.fire('Error', "Problem occured while uploading SSD Forecast, kindly review error message", 'error');
          this.missingItems = responseMessages.filter(c=> c.responseCode === '104');
          this.duplicateItems = responseMessages.filter(c=> c.responseCode === '106');
          this.otherErrors = responseMessages.filter(c=> c.responseCode !== '200' && c.responseCode !== '500' && c.responseCode !== '104' && c.responseCode !== '106');
          this.setSelectedTab();
        }
      }
    }
    else{
      Swal.fire('Error', ErrorMsg, 'error');
      this.files = [];
    }
  }

  handleError(error: any) {
    Swal.fire('Error', ErrorMsg, 'error');
    this.loading = false;
    this.files = [];
  }

  setSelectedTab(){
    if(this.missingItems.length)
      this.selectedTabIndex = 0;
    if(this.duplicateItems.length)
      this.selectedTabIndex = 1;
    if(this.otherErrors.length)
      this.selectedTabIndex = 2;
  }

}
