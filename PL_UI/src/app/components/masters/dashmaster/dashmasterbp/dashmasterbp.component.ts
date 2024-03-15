import { Component, OnInit } from '@angular/core';
import { DashmasterService } from '../dashmaster.service';

@Component({
  selector: 'app-dashmasterbp',
  templateUrl: './dashmasterbp.component.html',
  styleUrls: ['./dashmasterbp.component.scss']
})
export class DashmasterbpComponent implements OnInit {
  dashMasterBpList: any;
  public isCollapsed8 = false;
  public isClosed8 = false;
  dashMasterFileName = "DashmasterMonthly_" + new Date().toDateString();
  constructor(private readonly dashmasterService: DashmasterService,) { }

  ngOnInit(): void {
    this.dashMasterBpList = this.dashmasterService.getDashMasterBp();
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }

}
