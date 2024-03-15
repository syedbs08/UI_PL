import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Item } from 'angular2-multiselect-dropdown';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: 'app-userprofiledetails',
  templateUrl: './userprofiledetails.component.html',
  styleUrls: ['./userprofiledetails.component.scss']
})
export class UserprofiledetailsComponent implements OnInit {

  userObjectId: any;
  totalAssignDeparment: any;
  totalAssignProduct: any;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: MsalService) { }

  ngOnInit(): void {
    this.userObjectId = this.activeRoute.snapshot.paramMap.get('id');
  
    if(this.userObjectId==null)
    {
     this.userObjectId= this.authService.instance.getActiveAccount()?.idTokenClaims?.oid!;
    }
  }


  onBackClick($event: boolean) {
    this.location.back()
  }
  totalDeparmentCount(count: string) {
    this.totalAssignDeparment = count;
  }

  totalProductCount(count: string) {
    this.totalAssignProduct = count;
  }
}
