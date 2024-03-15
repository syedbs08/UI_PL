import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { catchError, concat, debounceTime, distinctUntilChanged, filter, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { protectedResources } from 'src/app/configs/auth-config';
import { GraphService, ProviderOptions } from 'src/app/shared/services/graph.service';
import Swal from 'sweetalert2';
import { MasterserviceService } from '../../masterservice.service';
import { UserADService } from '../../user-ad.service';
import { DxDataGridComponent } from 'devextreme-angular';


@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermanagementComponent implements OnInit {
  minLengthTerm = 3;
  userLoading: boolean = false;
  roles: any;
  userAccessForm: FormGroup;
  loading = false;
  submitted = false;
  public isCollapsed8 = false;
  public isClosed8 = false;
  dtOptions: any;
  userList: any;
  showTable: boolean = true;
  selectedUser: any;
  users$: Observable<any>;
  usersSearch$ = new Subject<string>();
  newEntry = false;
  excelLoading = false;
  providerOptions: ProviderOptions;
  userListFileName = "UserList_" + new Date().toDateString();
  @ViewChild('userAccessModal') userAccessModal: ElementRef;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  constructor(private readonly masterService: MasterserviceService,
    private readonly userADService: UserADService,
    private _fBuilder: FormBuilder,
    private modalService: NgbModal,
    private authService: MsalService,
    private graphService: GraphService) {
    this.loadUsers();
    this.loadRoles();
    

  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.initateUserSearch();

  }
  onExportClick($event) {
    this.excelLoading = true;
    this.masterService.downloadExcels("export-user", "user-list")
      .subscribe((result: any) => {
        var blob = new Blob([result]);
        let saveAs = require('file-saver');
        saveAs(blob, "userlist" + new Date().toTimeString() + ".xlsx");
        this.excelLoading = false;

      });
  }
  Collapsetoggle8() {
    this.isCollapsed8 = !this.isCollapsed8;
  }
  Closetoggle8() {
    this.isClosed8 = true
  }
  get f() { return this.userAccessForm.controls; }
  loadUsers() {
  this.dtOptions = this.masterService.getUsersAll();
    
  }
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  syncUser()
  {
    this.masterService.syncUser().subscribe((result: any) => {
      this.dataGrid.instance.refresh();
    });
  }
  userRoles(roleList: any) {
 
   
    return Array.prototype.map.call(roleList, function (item) { return item.value; }).join(", ");
  }
  initializeFormControl() {
    this.userAccessForm = this._fBuilder.group({
      Role: [[], [RxwebValidators.required()]],
      UserPrincipalId: ['', [RxwebValidators.required()]],
      ExistingRoles: [[], [RxwebValidators.required()]]
    });
  }

  loadRoles() {
    this.masterService.getRoles()
      .pipe()
      .subscribe({
        next: (x) => (this.roles = x),
        error: (x) => (console.log(x))
      });
  }
  onEdit(user) {
    this.userAccessForm.reset();
    this.selectedUser = user;
    this.userAccessForm.patchValue({
      Role: user.roleList,
      UserPrincipalId: user.userId,
      ExistingRoles: user.roleList

    });
    this.modalService.open(this.userAccessModal, { backdrop: 'static' });
    this.newEntry = false;
  }
  onUserSelect(user) {
    this.userAccessForm.reset();
    this.selectedUser = user;
    this.userAccessForm.patchValue({
      Role: [],
      UserPrincipalId: user.id,
      ExistingRoles: []

    });

  }
  onSubmit() {
    this.submitted = true;
    if (this.userAccessForm.invalid) {
      return;
    }

    var roles: any[] = [];
    var deleteRoles: any[] = [];

    deleteRoles = this.f.ExistingRoles.value.filter((el) => {
      return !this.f.Role.value.some((f) => {
        return el.id === f.id
      });
    });

    roles = this.f.Role.value.filter((el) => {
      return !this.f.ExistingRoles.value.some((f) => {
        return el.id === f.id
      });
    });

    if (roles.length == 0 && deleteRoles.length == 0) {
      Swal.fire('Warning', "You have not selected any roles to add or delete", 'warning');
      return;
    }
    var command =
    {
      PrincipalId: this.f.UserPrincipalId.value,
      RoleIds: roles.length > 0 ? roles.map(a => a.id) : [],
      DeletedRoles: deleteRoles.length > 0 ? deleteRoles.map(a => a.roleAssignmentId) : [],
      BackendRoleId: roles.length > 0 ? roles.map(a => a.backendId) : [],
      DeletedBackendRoleIds: deleteRoles.length > 0 ? deleteRoles.map(a => a.backendRoleAssignmentId) : [],
    }

    ///check if both app has updated roles to delete
    if (deleteRoles.length != deleteRoles.map(a => a.backendRoleAssignmentId).length) {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure ?',
        html: 'Seems there is delay in updating your previous action , Kindly reload the user list and try again ',
        showCancelButton: true,
        confirmButtonColor: '#7367f0',
        cancelButtonColor: '#f5334f',
        confirmButtonText: 'Refresh',
        reverseButtons: true

      }).then((result) => {
        if (result.isConfirmed) {

          this.dataGrid.instance.refresh();
        }
      });

      return;


    }


    if (deleteRoles.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure ?',
        html: 'you have selected   <span style="font-size:12px; color:#f5334f;">' + deleteRoles.map(a => a.value).join(', ') + '</span> roles to be removed !',
        showCancelButton: true,
        confirmButtonColor: '#7367f0',
        cancelButtonColor: '#f5334f',
        confirmButtonText: 'Yes',
        reverseButtons: true

      }).then((result) => {
        if (result.isConfirmed) {

          this.submitData(command);
        }
      })
    }
    else {

      this.submitData(command);

    }

  }
  submitData(command) {

    this.masterService
      .userRoleMapping(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      });
  }
  handleSuccess(data: any) {
    this.loading = false;
    Swal.fire('Success', "User role mapping successfully Submitted", 'success');
    this.reload()

    this.modalService.dismissAll('Close click');

  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }

  onClosePopUp() {
    this.userAccessForm.reset();
    this.modalService.dismissAll('Close click');

  }
  reload() {
    this.showTable = false;
    setTimeout(() => {
      this.showTable = true;
    }, 0);
    this.userAccessForm.reset();
    this.newEntry = false;
    this.dataGrid.instance.refresh();
  }

  initateUserSearch() {
    this.users$ = concat(
      of([]), // default items
      this.usersSearch$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.userLoading = true),
        switchMap(term => {

          return this.userLookup(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.userLoading = false)
          )
        })
      )
    );
  }
  userLookup(term: string): Observable<any> {
    return this.userADService.getUsers(term);
  }
  onAddNewClick(event: any) {
    this.selectedUser = null;
    if (event == true) {
      this.modalService.open(this.userAccessModal);
      this.newEntry = true;
    }
  }

  deleteAllAccess(user) {
    var roleList = user.roleList.map(a => a.roleAssignmentId);
    var command =
    {
      PrincipalId: user.userId,
      RoleIds: [],
      BackendRoleId: [],
      DeletedRoles: roleList,
      DeletedBackendRoleIds: user.roleList.map(a => a.backendRoleAssignmentId)
    }
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure ?',
      html: 'All access for this user will be revoked',
      showCancelButton: true,
      confirmButtonColor: '#7367f0',
      cancelButtonColor: '#f5334f',
      confirmButtonText: 'Yes',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {

        this.submitData(command);
      }
    })

  }



}
