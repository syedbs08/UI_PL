import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, switchMap } from 'rxjs';
import { ApiconstantService } from 'src/app/shared/helpers/apiconstant.service';
import { HttpModuleService } from 'src/app/shared/helpers/http-client-service';
@Injectable({
    providedIn: 'root'
})
export class ProductcategoryService {
    public productCategoryList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
        []
    );
    public productCategoryUserList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
        []
    );
    constructor(private httpHelper: HttpModuleService,
        private apiUrl: ApiconstantService) {
        this.getProductCategory();
        this.getUserProductCategory();
    }
    getData(): Observable<any[]> {
        return this.productCategoryList;
    }
    getUserData(): Observable<any[]> {
        return this.productCategoryUserList;
    }
    getProductCategory() {
        this.httpHelper.apiGet(this.apiUrl.urlMaster + "productcategories", null).subscribe(resp => {
            this.productCategoryList.next(resp);
        });
        return this.httpHelper.apiGet(this.apiUrl.urlMaster + "productcategories", null);
    }
    getUserProductCategory() {
        this.httpHelper.apiGet(this.apiUrl.urlMaster + "user-productcategories", null).subscribe(resp => {
            this.productCategoryUserList.next(resp);
        });
      //  return this.httpHelper.apiGet(this.apiUrl.urlMaster + "user-productcategories", null);
    }
    addeditProductCategory(command) {
        return this.httpHelper.apiPost(this.apiUrl.urlMaster + "add-product-category", command);
    }
    //will change later
    getMgs(typeId: number): Observable<any[]> {
        return this.getData().pipe(
            map(x => {
                return x.filter(y => y.categorylevel === typeId)
            })
        );
    }
    getUserMgs(typeId: number): Observable<any[]> {
        return this.getUserData().pipe(
            map(x => {
                return x.filter(y => y.categorylevel === typeId)
            })
        );
    }
}