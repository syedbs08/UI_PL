import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcategoryMasterComponent } from './productcategory-master.component';

describe('ProductcategoryMasterComponent', () => {
  let component: ProductcategoryMasterComponent;
  let fixture: ComponentFixture<ProductcategoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductcategoryMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductcategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
