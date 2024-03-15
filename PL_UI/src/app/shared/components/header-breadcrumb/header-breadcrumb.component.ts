import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-breadcrumb',
  templateUrl: './header-breadcrumb.component.html',
  styleUrls: ['./header-breadcrumb.component.scss']
})
export class HeaderBreadcrumbComponent implements OnInit {

  @Input() title!: string;
  @Input() items!: any[];
  @Input() active_item!: string;
  @Input() showAddNew: boolean=true;
  @Input() showExport: boolean=false;
  @Input() showOtherButton: boolean=false;
  @Input() addButtonTitle:string="Add New";
  @Input() OtherButtonTitle:string;
  @Input() icon:string="fa fa-plus";
  @Input() otherIcon:string;
  @Output() openPopUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onOtherButtonclick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onExportClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() loading = false;
  constructor() { }

  ngOnInit(): void {
  }
  onAddNew() {
    this.openPopUp.emit(true);    
  }
  onOtherclick(){
    this.onOtherButtonclick.emit(true);    
  }
  onExportClick(){
    this.loading=true;
    this.onExportClickEvent.emit(true);    
  }
}
