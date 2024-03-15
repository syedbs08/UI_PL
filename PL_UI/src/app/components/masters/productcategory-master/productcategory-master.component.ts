import { Component,ElementRef, OnInit, ViewChild  } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MasterserviceService } from '../masterservice.service';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormArray,FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductcategoryService } from '../productcategory-master/productcategory.service';
interface FoodNodeFlat {
  name: string;
  id:number;
  parentId:number;
  categorylevel:number;
  code:string;
  isactive:boolean;
  children?: FoodNodeFlat[];
}
@Component({
  selector: 'app-productcategory-master',
  templateUrl: './productcategory-master.component.html',
  styleUrls: ['./productcategory-master.component.scss']
})

export class ProductcategoryMasterComponent implements OnInit {
  showEditCategory: boolean = false;
  showAddCategory:boolean=false;
  submitted=false;
  editProductCategoryForm:FormGroup;
  addProductCategoryForm:FormGroup;
  loading = false;
  showTree:boolean=true;
  public items: BehaviorSubject<FoodNodeFlat[]> = new BehaviorSubject<FoodNodeFlat[]>(
    []
);



  private _transformer = (node: FoodNodeFlat, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      code:node.code,
      id:node.id,
      parentId:node.parentId,
      categorylevel:node.categorylevel,
      isactive:node.isactive,
    };
  };
 
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)
  constructor(private readonly masterService: MasterserviceService,
    private readonly productcategoryService:ProductcategoryService, 
    private _fBuilder: FormBuilder) {
    this.loadCategories();
     }
     loadCategories() {
      this.productcategoryService.getProductCategory()
        .pipe()
        .subscribe((resp) => {
         this.items.next(resp);
         this.dataSource.data = this.treeConstruct(this.items.value);
          error: (x) => (console.log(x))
        });
    }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  getData(): Observable<FoodNodeFlat[]> {

    return this.items;
}
  ngOnInit(): void {
    this.initializeFormControl();
  }
  get editFrom() { return this.editProductCategoryForm.controls; }
  get addFrom() { return this.addProductCategoryForm.controls; }
  initializeFormControl() {
    this.editProductCategoryForm = this._fBuilder.group({
      ProductCategoryName: ['', [RxwebValidators.required()]],
      ProductCategoryCode: ['', [RxwebValidators.required()]],
      ParentCategoryId: [0],
      IsActive: [true],
      ProductCategoryId: [0],
      CategoryLevel:[0]
    });
    this.addProductCategoryForm = this._fBuilder.group({
      ProductCategoryName: ['', [RxwebValidators.required()]],
      ProductCategoryCode: ['', [RxwebValidators.required()]],
      ParentCategoryId: [0],
      IsActive: [true],
      ProductCategoryId: [0],
      CategoryLevel:[0],
      ParentCategoryName:null,
    });
  }
  resetForm()
  {
    this.addProductCategoryForm.reset({ ProductCategoryId: 0,ParentCategoryId:0,CategoryLevel:0, IsActive: true });
    this.addProductCategoryForm.reset({ ProductCategoryId: 0,ParentCategoryId:0,CategoryLevel:0, IsActive: true });
    this.submitted = false;
    this.loading=false;
  }
  onAddSubmit(){
    this.submitted = true;
     if (this.addProductCategoryForm.invalid) {
       return;
     }
     var command = {
       ProductCategoryId: this.addFrom.ProductCategoryId.value,
       ProductCategoryName: this.addFrom.ProductCategoryName.value,
       ProductCategoryCode: this.addFrom.ProductCategoryCode.value,
       ParentCategoryId:this.addFrom.ParentCategoryId.value,
       CategoryLevel:this.addFrom.CategoryLevel.value,
       IsActive: true
     }
     this.loading = true;
     this.productcategoryService.addeditProductCategory(command)
       .pipe()
       .subscribe({
         next: this.handleSuccess.bind(this,command.ProductCategoryId),
         error: this.handleError.bind(this)
 
       });
  }
  onUpdateSubmit() {
    this.submitted = true;
   if (this.editProductCategoryForm.invalid) {
    return;
  }
    var command = {
      ProductCategoryId: this.editFrom.ProductCategoryId.value,
      ProductCategoryName: this.editFrom.ProductCategoryName.value,
      ProductCategoryCode: this.editFrom.ProductCategoryCode.value,
      ParentCategoryId: this.editFrom.ParentCategoryId.value,
      CategoryLevel: this.editFrom.CategoryLevel.value,
      IsActive: this.editFrom.IsActive.value
    }
    this.loading = true;
    this.productcategoryService.addeditProductCategory(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this,command.ProductCategoryId),
        error: this.handleError.bind(this)

      });
  }
  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
 
  }
  handleSuccess(data: number) {
    this.loading = false;
    if(data==0)
    {
     Swal.fire('Success', "Product Category added successfully", 'success');
    }
   else{
     Swal.fire('Success', "Product Category updated successfully", 'success');
   }
    this.reload()
  }
  reload(){
    this.onCancelClick();
    this.loadCategories();
    this.showTree = false;
    setTimeout(() => {
      this.showTree = true;
    }, 0);
    this.editProductCategoryForm.reset({ ProductCategoryId: 0,ParentCategoryId:0,CategoryLevel:0, IsActive: true });
    this.addProductCategoryForm.reset({ ProductCategoryId: 0,ParentCategoryId:0,CategoryLevel:0, IsActive: true });
  }
  onAddNewClick($event: boolean) {
    //this.reload();
    this.addProductCategoryForm.patchValue({
      ProductCategoryId:0,
      ProductCategoryName:"",
      ProductCategoryCode:"",
      ParentCategoryId: null,
      CategoryLevel: 1,
      IsActive: true,
      ParentCategoryName:"Master Category",
    });
    this.showAddCategory=true;
    this.showEditCategory=false;
  }
  addSubCategoryClick(){
    var command = {
      ProductCategoryId: this.editFrom.ProductCategoryId.value,
      ProductCategoryName: this.editFrom.ProductCategoryName.value,
      ProductCategoryCode: this.editFrom.ProductCategoryCode.value,
      ParentCategoryId: this.editFrom.ParentCategoryId.value,
      CategoryLevel: this.editFrom.CategoryLevel.value,
      IsActive: this.editFrom.IsActive.value
    }
    this.addProductCategoryForm.patchValue({
      ProductCategoryId: 0,
      ProductCategoryName: "",
      ProductCategoryCode: "",
      ParentCategoryId: command.ProductCategoryId,
      CategoryLevel: command.CategoryLevel+1,
      IsActive: true,
      ParentCategoryName:command.ProductCategoryName,
    });
    this.showAddCategory=true;
    this.showEditCategory=false;
  }
  editCategoryClick(node){
    this.editProductCategoryForm.patchValue({
      ProductCategoryId: node.id,
      ProductCategoryName: node.name,
      ProductCategoryCode: node.code,
      ParentCategoryId: node.parentId,
      CategoryLevel: node.categorylevel,
      IsActive: node.isactive,
    });
this.showEditCategory=true;
this.showAddCategory=false;
  }
  onCancelClick(){
    this.showEditCategory=false;
    this.showAddCategory=false;
  }

  treeConstruct(treeData) {
    let constructedTree = [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned)
    }
    return constructedTree;
  }
constructTree(constructedTree, treeObj, assigned) {
if (treeObj.parentId == 0) {
      treeObj.children = [];
      constructedTree.push(treeObj);
      return true;
    } else if (treeObj.parentId == constructedTree.id) {
      treeObj.children = [];
      constructedTree.children.push(treeObj);
      return true;
    }
    else {
      if (constructedTree.children != undefined) {
        for (let index = 0; index < constructedTree.children.length; index++) {
          let constructedObj = constructedTree.children[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      } else {
        for (let index = 0; index < constructedTree.length; index++) {
          let constructedObj = constructedTree[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      }
      return false;
    }
  }

}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  code:string;
  id:number;
  parentId:number;
  categorylevel:number;
  isactive:boolean;
}