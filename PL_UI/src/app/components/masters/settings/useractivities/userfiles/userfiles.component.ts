import { Component, Input, OnInit } from '@angular/core';
import { MasterserviceService } from '../../../masterservice.service';

@Component({
  selector: 'app-userfiles',
  templateUrl: './userfiles.component.html',
  styleUrls: ['./userfiles.component.scss']
})
export class UserfilesComponent implements OnInit {
  @Input() fileList: any;
 
  constructor(private readonly masterService: MasterserviceService) { }

  ngOnInit(): void {
  }

  onDownload(data) {
    this.masterService.downloadFile(data.virtualFileName, data.folderName)
    .subscribe((result: any) => {
      var blob = new Blob([result]);
      let saveAs = require('file-saver');
      saveAs(blob, data.documentName);
    });

  }
 
}
