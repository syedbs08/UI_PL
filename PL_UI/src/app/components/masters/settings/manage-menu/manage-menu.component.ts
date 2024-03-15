import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

import { MasterserviceService } from '../../masterservice.service';

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.scss']
})
export class ManageMenuComponent implements OnInit {
  public isCollapsed8 = false;
  public isClosed8 = false;
  menuForm: FormGroup;
  ChildMenus: FormArray;
  loading = false;
  submitted = false;
  menuLookupList: any;
  showExportButton: boolean = false;
  showAddNewButton: boolean = true;
  showOtherButton: boolean = false;
  selectedMenu: any;
  menuRoles: any;
  menulist: any;
  userListFileName = "MenuList_" + new Date().toDateString();
  @ViewChild(DataTableDirective)
  private datatableElement: DataTableDirective;
  showEntryScreen: boolean = false;
  @ViewChild('menumodal') menumodal: ElementRef;
  showTable: boolean = true;
  constructor(private modalService: NgbModal,
    private readonly masterService: MasterserviceService,
    private _fBuilder: FormBuilder) {
    this.loadMenuLookUp();
    this.loadRoles();

  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.loadMenus();
  }
  get f() { return this.menuForm.controls; }

  getChildControls() {
    return (this.menuForm.get("ChildMenus") as FormArray).controls;
  }
  get childMenusForm(): FormArray {
    return this.menuForm.get("ChildMenus") as FormArray;
  }
  initializeFormControl() {
    this.menuForm = this._fBuilder.group({
      ParentMenu: ['', [RxwebValidators.required()]],
      Icon: ['', [RxwebValidators.required()]],
      Roles: ['', [RxwebValidators.required()]],
      Order: [0, [RxwebValidators.required()]],
      ChildMenus: new FormArray([])
    });
  }

  CreateSingleRow(): FormGroup {
    return this._fBuilder.group({
      Title: [null, [RxwebValidators.required()]],
      Url: [null, [RxwebValidators.required()]],
      Roles: [this.f.Roles.value, [RxwebValidators.required()]]
    });
  }
  //events
  onAddNewClick($event: boolean) {
    this.showEntryScreen = true;
    this.menuForm.reset();
    this.selectedMenu = null;
    this.showExportButton = false;
    this.showAddNewButton = false;
    this.showOtherButton = true;
  }
  loadMenuLookUp() {
    this.masterService.getMenuLookup().pipe()
      .subscribe({
        next: (x) => (this.menuLookupList = x),
        error: (x) => (console.log(x))
      });
  }

  loadRoles() {
    this.masterService.getRoles()
      .pipe()
      .subscribe({
        next: (x) => (this.menuRoles = x),
        error: (x) => (console.log(x))
      });
  }
  loadMenus() {
    this.menulist = this.masterService.getMenus();

  }

  addNewParent = (term) => (
    {
      title: term
    });

  addItem(): void {
    this.ChildMenus = this.menuForm.get("ChildMenus") as FormArray;
    this.ChildMenus.push(this.CreateSingleRow());
  }
  DeleteRow(index): void {
    this.childMenusForm.removeAt(index);
  }
  backButton() {
    this.reload();
  }
  onParentMenuSelect(menu) {
    this.showExportButton = false;
    this.showAddNewButton = false;
    this.showOtherButton = true;
    this.selectedMenu = menu;
    this.menuForm.patchValue({
      ParentMenu: menu.title,
      Icon: menu.icon,
      Roles: menu.roles.split(','),
      Order: menu.order
    });
    const childrens: FormArray = this.menuForm.get("ChildMenus") as FormArray;
    childrens.clear();
    menu.children.forEach((element) => {
      childrens.push(
        this._fBuilder.group({
          Title: [element.title, [RxwebValidators.required()]],
          Url: [element.path, [RxwebValidators.required()]],
          Roles: [element.roles.split(','), [RxwebValidators.required()]]
        })
      )
    });

    this.showEntryScreen = true;
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  reload() {
    this.showTable = false;
    this.loadMenus();
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.showExportButton = false;
    this.showAddNewButton = true;
    this.showOtherButton = false;
    this.menuForm.reset({ ParentMenu: 0 });
    const childrens: FormArray = this.menuForm.get("ChildMenus") as FormArray;
    childrens.clear();
    this.showEntryScreen = false;
    this.selectedMenu = null;
  }

  // expandRow(trRef, rowData) {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     var row = dtInstance.row(trRef);
  //    // var tr = $(row).closest('tr');

  //     var tr = $(this).closest(trRef);
  //     //var row = table.row( tr );

  //     if (row.child.isShown()) {
  //       row.child.hide();

  //       this._renderer.removeClass(trRef, 'shown');
  //     }
  //     else {
  //    //   const childTable = this.getTable(rowData.children);
  //       row.child(this.format(rowData.children)).show();
  //       //row.child(childTable).show();
  //       tr.addClass('shown');

  //     }
  //   })
  // }
  // expandRow(trRef, rowData) {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     var row = dtInstance.row(trRef);
  //    // var tr = $(row).closest('tr');

  //     var tr = $(this).closest(trRef);
  //     //var row = table.row( tr );

  //     if (row.child.isShown()) {
  //       row.child.hide();

  //       this._renderer.removeClass(trRef, 'shown');
  //     }
  //     else {
  //    //   const childTable = this.getTable(rowData.children);
  //       row.child(this.format(rowData.children)).show();
  //       //row.child(childTable).show();
  //       tr.addClass('shown');

  //     }
  //   })
  // }
  // format(data) {
  //   return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
  //         '<tr>'+
  //             '<td>Full name:</td>'+
  //             '<td>'+data[0].title+'</td>'+
  //         '</tr>'+
  //         '<tr>'+
  //             '<td>Extension number:</td>'+
  //             '<td>'+data[0].title+'</td>'+
  //         '</tr>'+
  //         '<tr>'+
  //             '<td>Extra info:</td>'+
  //             '<td>And any further details here (images etc)...</td>'+
  //         '</tr>'+
  //     '</table>';
  // }
  onSubmit() {
    this.submitted = true;
    if (this.menuForm.invalid) {
      return;
    }
    var childMenu = this.menuForm.get("ChildMenus") as FormArray;
    if (!childMenu.valid) {
      return;
    }

    this.loading = true;
    var children: any[] = [];;
    childMenu.value.forEach(function (value, key) {
      children.push({
        Title: value.Title,
        Path: value.Url,
        Roles: value.Roles,
        Icon: ""
      });
    });

    // Extract 'Roles' from objects in the 'children' array
    var rolesArray = children.map(x => x.Roles);
    // Flatten the 'rolesArray' into a single array of roles
    var allRoles = [].concat.apply([], rolesArray);
    // Get unique roles using Set
    var uniqueRoles = Array.from(new Set(allRoles));
    const ddlroles = this.f.Roles.value;
    const rolesNotInDdlRoles = uniqueRoles.filter(role => !ddlroles.includes(role));
    if (rolesNotInDdlRoles.length>0) {
      Swal.fire('Error', "Please select same role("+rolesNotInDdlRoles+") in role dropdown ", 'error');
      this.loading = false;
      this.submitted=false;
      return;
    }
    var command = {
      Title: this.f.ParentMenu.value,
      Path: "",
      Roles: this.f.Roles.value,
      Order: this.f.Order.value,
      Icon: this.f.Icon.value,
      Children: children
    };
    this.masterService
      .addMenus(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "Menu added successfully", 'success');
    this.menuForm.reset();
    this.f.Children = new FormArray([]);
    this.showEntryScreen = false;
    this.reload()
    this.selectedMenu = null;

  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;

  }
  onCancel() {
    this.reload();
  }
}
