import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPricingComponent } from './stock-pricing.component';

describe('StockPricingComponent', () => {
  let component: StockPricingComponent;
  let fixture: ComponentFixture<StockPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockPricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
