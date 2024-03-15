import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { SNSPlanning, SNSPlanningSummary } from 'src/app/shared/models/sns-planning.model';
import { SnsService } from '../sns.service';
import Swal from 'sweetalert2';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-sns-planning-form',
  templateUrl: './sns-planning-form.component.html',
  styleUrls: ['./sns-planning-form.component.scss']
})
export class SnsPlanningFormComponent implements OnInit {
  public fullScreen: boolean = false;
  @Output() hasChangedData = new EventEmitter<boolean>(false);

  // @ViewChild('gridContainer') devGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @Input() snsPlanningSummary: SNSPlanningSummary;
  showGridPanel: boolean = true;
  isClosedPanel: boolean = false;
  isCollapsedPanel: boolean = false;
  snsPlanningList: SNSPlanning[] = [];
  data: SNSPlanning[] = [];
  loading: boolean = false;
  editOnkeyPress: boolean;
  enterKeyAction: string;

  enterKeyDirection: string;
  @ViewChild('commentEntryModal') commentEntryModal: ElementRef;
  commentForm: FormGroup;
  commentList: any[] = [];
  submitted: boolean = false;
  public isCollapsed8 = false;
  enterKeyActions: Array<string>;
  enterKeyDirections: Array<string>;
  constructor(private modalService: NgbModal,
    private _fBuilder: FormBuilder,
    private readonly snsService: SnsService,
    private el: ElementRef,
    private renderer: Renderer2) {
    this.editOnkeyPress = true;
    this.enterKeyAction = 'moveFocus';
    this.enterKeyDirection = 'column';
  }

  ngOnInit(): void {
    this.data = this.snsPlanningSummary.planningData
    this.snsPlanningSummary.planningData.forEach(element => {
      if (element.description === 'Stock Days') {
        this.data = this.stockDaysCalculation(element, this.snsPlanningSummary.planningData);
      }
    });
    this.snsPlanningList = this.data;
    this.initializeFormControl();
  }
  onFocusedCellChanging(e) {
    e.isHighlighted = true;
  }

  onCellClick(e) {
    if (e.rowType == 'data') {
      if (e.value == 0) {
        e.value = "";
      }


    }
  }

  collapseToggle() {
    this.isCollapsedPanel = !this.isCollapsedPanel;
  }
  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  }
  openFullscreen() {
    this.fullScreen = !this.fullScreen;
    if (this.fullScreen === true) {

      this.dataGrid.height = window.outerHeight - 240;
    }
  }
  onCellPrepared(e) {

    if (e.rowType === "data") {
      if (e.columnIndex == 4) {
        e.cellElement.style.cssText = "background-color: #80e5b1;border: 1px solid black;";
      }
      if ((e.data.description == "GIT Arrivals" || e.data.description == "INVENTORY"

        || e.data.description == "CUSTOMERS" || e.data.description == "Stock Days") && e.columnIndex > 4) {
        e.cellElement.style.cssText = "background-color: #80e5b1;border: 1px solid black;";
      }
      if (e.data.description == "PURCHASE" && e.columnIndex >= 6) {
        e.cellElement.style.cssText = "background-color: #80e5b1;border: 1px solid black;";
      }
      if (e.data.description == "PURCHASE" && e.columnIndex == 5) {
        e.cellElement.style.cssText = "border: 1px solid black;";
      }
      if (e.data.description == "SALES" && e.columnIndex > 4) {
        e.cellElement.style.cssText = "background-color: #f7bd00; font-weight: bold;border: 1px solid black;";
      }
      if (e.data.description == "SALES" && e.columnIndex == 4) {
        e.cellElement.style.cssText = "background-color:#80e5b1;font-weight: bold;border: 1px solid black;";
      }
      if ((e.data.description == "ADJ") && e.columnIndex > 4) {
        e.cellElement.style.cssText = "border: 1px solid black;";
      }
      if ((e.data.description == "ORDER" || e.data.description == "MPO") && e.columnIndex > 4) {
        e.cellElement.style.cssText = "border: 1px solid black;";
      }
      if (e.data.modeofType == null && e.data.description != "CUSTOMERS" && e.columnIndex > 4) {
        e.cellElement.style.cssText = "border: 1px solid black;";
      }
      if (e.columnIndex > 0 && e.columnIndex < 4) {
        e.cellElement.style.cssText = "border: 1px solid black;";
      }
      //this.stockDaysCalculation(e.data);
    }
  }
  stockDaysCalculation(rowData: SNSPlanning, snsPlanningList) {
    const materialId = rowData.materialId
    const snsSummay = snsPlanningList.filter(c => c.materialId === materialId && c.customerId == null && c.description !== 'CUSTOMERS');
    const customerWiseSales = snsPlanningList.filter(c => c.materialId === materialId && c.customerId !== null);
    snsSummay.forEach((item, idx) => {
      switch (item.description) {
        case 'Stock Days':
          this.snsPlanningSummary.monthList.forEach((month, midx) => {
            const inventoryRow = snsSummay.find(c => c.description === 'INVENTORY');
            const salesRow = snsSummay.find(c => c.description === 'SALES');
            let monthInventory = 0;
            let nxtthreeMonthSale = 0;
            let stockdays = 0;

            if (inventoryRow && inventoryRow['month' + (midx) + 'Quantity'] !== undefined) {
              monthInventory = inventoryRow['month' + (midx) + 'Quantity'];
            }
            if (salesRow && salesRow['month' + (midx) + 'Quantity'] !== undefined || salesRow && salesRow['month' + (midx + 1) + 'Quantity'] !== undefined || salesRow && salesRow['month' + (midx + 2) + 'Quantity'] !== undefined) {
              nxtthreeMonthSale = salesRow['month' + (midx + 1) + 'Quantity'] + salesRow['month' + (midx + 2) + 'Quantity'] + salesRow['month' + (midx + 3) + 'Quantity'];
            }
            nxtthreeMonthSale = nxtthreeMonthSale ?? 0;
            if (nxtthreeMonthSale == 0) {
              item['month' + midx + 'Quantity'] = null;
            } else {
              if (midx == 5) {
                nxtthreeMonthSale = nxtthreeMonthSale/2;
              }
              else if (midx == 6) {
                nxtthreeMonthSale = nxtthreeMonthSale;
              } else {
                nxtthreeMonthSale = nxtthreeMonthSale / 3;
              }
              stockdays = (monthInventory / nxtthreeMonthSale) * 30;
              item['month' + midx + 'Quantity'] = stockdays == 0 ? null : Math.round(stockdays);
            }

            item.isUpdated = true;
          });
          break;

      }
    });
    return snsPlanningList;
  }


  onEditorPreparing(e) {
    this.enterKeyAction = 'moveFocus';
    // if (e.parentType === 'dataRow' && e.editorName === 'dxTextBox') {
    //   // e.editorOptions.onKeyPress = (event) => {
    //   //   // Clear the value whenever any key is pressed
    //   //   e.setValue('');
    //   // };
    //   e.editorOptions.onKeyDown = (event) => {
    //     if (event.event.key === 'Tab') {
    //       // Clear the value
    //       e.setValue('');
    //     }
    //   };
    // }

    if (e.row.data) {
      e.editorOptions.disabled = e.row.data.disableEditQuantity;
      if (e.dataField === 'month0Quantity' &&
        (e.row.data.description === 'ORDER' || e.row.data.description === 'MPO' || e.row.data.description === 'ADJ' || e.row.data.customerId !== null)) {
        e.editorOptions.disabled = true;
        e.editorOptions.onFocusIn = function (arg) {
          if (arg.component.option("value") == 0)
            arg.component.option("value", null);
        }
      }
      if (e.row.data.description === 'PURCHASE' && e.dataField !== 'month1Quantity') {
        e.editorOptions.disabled = true;

      }
      if (e.row.data.description === 'Stock Days') {
        e.editorOptions.disabled = true;

      }
      if (e.editorOptions.disabled) {
        e.editorOptions.inputAttr = { style: { backgroundColor: 'red' } };
      }
      if ((e.row.data.description === 'ORDER' || e.row.data.description === 'MPO'
        || e.row.data.description === 'PURCHASE' || e.row.data.customerId !== null)
        && e.value == 0) {
        e.editorOptions.onFocusIn = function (arg) {
          if (arg.component.option("value") == 0)
            arg.component.option("value", null);
        }
        e.editorOptions.onFocusOut = function (arg) {
          if (arg.component.option("value") == null)
            arg.component.option("value", null);
        }

      }
    }



  }

  onRowUpdated(e: any) {
    e.data.isUpdated = true;
    this.hasChangedData.emit(true);
    this.calculateRollingInventory(e.data);
  }

  getTitleHeaderCpation(index) {
    switch (index) {
      case 0:
        return 'RESULT';
      case 1:
        return 'CURRENT';
      case 2:
        return 'LOCK';
      case 3:
        return 'INDI';
      default:
        return '';
    }
  }

  calculateRollingInventory(rowData: SNSPlanning) {
    const materialId = rowData.materialId
    const snsSummay = this.snsPlanningList.filter(c => c.materialId === materialId && c.customerId == null && c.description !== 'CUSTOMERS');
    const customerWiseSales = this.snsPlanningList.filter(c => c.materialId === materialId && c.customerId !== null);
    //if(rowData.customerId){
    //customerWiseSales
    this.snsPlanningSummary.monthList.forEach((month, index) => {
      if (index != 0) {
        const monthCustomerSaleQtyList = customerWiseSales.filter(c => c['month' + index + 'Quantity'] !== null && c['month' + index + 'Quantity'] !== '');
        let totalMonthSale = 0;
        monthCustomerSaleQtyList.forEach((item) => {
          totalMonthSale += (+item['month' + index + 'Quantity'] ?? 0);
        });
        const saleRowData = snsSummay.find(c => c.description === 'SALES' && c.type === 'S&S');
        if (saleRowData) {
          saleRowData['month' + index + 'Quantity'] = totalMonthSale == 0 ? null : (+totalMonthSale ?? 0);
          saleRowData.isUpdated = true;
        }
      }
    });

    if (rowData.description === 'PURCHASE') {
      this.snsPlanningSummary.monthList.forEach((month, midx) => {
        if (midx === 1) {
          const gitRow = snsSummay.find(c => c.description === 'GIT Arrivals');
          //const orderRow = snsSummay.find(c=> c.description === 'ORDER');
          if (gitRow && gitRow['month' + (midx - 1) + 'Quantity'] !== undefined) {
            if (gitRow['month' + (midx - 1) + 'Quantity'] != rowData['month' + midx + 'Quantity']) {
              gitRow['month' + (midx - 1) + 'Quantity'] = rowData['month' + midx + 'Quantity'];
              gitRow.isUpdated = true;
            }
          }

        }
      });
    }
    else if (rowData.description === 'ORDER') {
      const gitRow = snsSummay.find(c => c.description === 'GIT Arrivals');
      const purchaseRow = snsSummay.find(c => c.description === 'PURCHASE');
      this.snsPlanningSummary.monthList.forEach((month, midx) => {
        if (midx !== 0) {
          if (gitRow && gitRow['month' + (midx) + 'Quantity'] !== undefined) {
            if (gitRow['month' + midx + 'Quantity'] != rowData['month' + midx + 'Quantity']) {
              gitRow['month' + midx + 'Quantity'] = rowData['month' + midx + 'Quantity'];
              gitRow.isUpdated = true;
            }
          }

          if (purchaseRow && purchaseRow['month' + (midx + 1) + 'Quantity'] !== undefined) {
            if (purchaseRow['month' + (midx + 1) + 'Quantity'] != rowData['month' + midx + 'Quantity']) {
              purchaseRow['month' + (midx + 1) + 'Quantity'] = rowData['month' + midx + 'Quantity'];
              purchaseRow.isUpdated = true;
            }
          }
        }
      });

    }
    snsSummay.forEach((item, idx) => {
      switch (item.description) {
        case 'GIT Arrivals':

          break;
        case 'INVENTORY':
          this.snsPlanningSummary.monthList.forEach((month, midx) => {
            if (midx !== 0) {
              const inventoryRow = snsSummay.find(c => c.description === 'INVENTORY');
              const purchaseRow = snsSummay.find(c => c.description === 'PURCHASE');
              const mpoRow = snsSummay.find(c => c.description === 'MPO');
              const adjRow = snsSummay.find(c => c.description === 'ADJ');
              const salesRow = snsSummay.find(c => c.description === 'SALES');
              let lastMonthInventory: number = 0;
              let monthPurchase: number = 0;
              let monthMpo: number = 0;
              let monthADJ: number = 0;
              let monthSales: number = 0;
              if (inventoryRow && inventoryRow['month' + (midx - 1) + 'Quantity'] !== undefined) {
                lastMonthInventory = inventoryRow['month' + (midx - 1) + 'Quantity'];
              }
              if (purchaseRow && purchaseRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthPurchase = purchaseRow['month' + (midx) + 'Quantity'];
              }
              if (mpoRow && mpoRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthMpo = mpoRow['month' + (midx) + 'Quantity'];
              }
              if (adjRow && adjRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthADJ = adjRow['month' + (midx) + 'Quantity'];
              }
              if (salesRow && salesRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthSales = salesRow['month' + (midx) + 'Quantity'];
              }

              const monthInventory = (+lastMonthInventory ?? 0) + (+monthMpo ?? 0) + (+monthPurchase ?? 0) + (+monthADJ ?? 0) - (+monthSales ?? 0);
              item['month' + midx + 'Quantity'] = monthInventory;
              item.isUpdated = true;
            }
          }
          )
          break;
        case 'Stock Days':
          this.snsPlanningSummary.monthList.forEach((month, midx) => {
            if (midx !== 0) {
              const inventoryRow = snsSummay.find(c => c.description === 'INVENTORY');
              const salesRow = snsSummay.find(c => c.description === 'SALES');
              const purchaseRow = snsSummay.find(c => c.description === 'PURCHASE');
              const mpoRow = snsSummay.find(c => c.description === 'MPO');
              const adjRow = snsSummay.find(c => c.description === 'ADJ');
              let lastMonthInventory = 0;
              let monthPurchase = 0;
              let monthMpo = 0;
              let monthSales = 0;
              let monthADJ = 0;
              const stockRow = snsSummay.find(c => c.description === 'Stock Days');
              let nxtthreeMonthSale = 0;
              let stockdays = 0;
              if (inventoryRow && inventoryRow['month' + (midx - 1) + 'Quantity'] !== undefined) {
                lastMonthInventory = inventoryRow['month' + (midx - 1) + 'Quantity'];
              }
              if (purchaseRow && purchaseRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthPurchase = purchaseRow['month' + (midx) + 'Quantity'];
              }
              if (mpoRow && mpoRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthMpo = mpoRow['month' + (midx) + 'Quantity'];
              }
              if (salesRow && salesRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthSales = salesRow['month' + (midx) + 'Quantity'];
              }
              if (adjRow && adjRow['month' + (midx) + 'Quantity'] !== undefined) {
                monthADJ = adjRow['month' + (midx) + 'Quantity'];
              }
              const monthInventory = (+lastMonthInventory ?? 0) + (+monthMpo ?? 0) + (+monthPurchase ?? 0) + (+monthADJ ?? 0) - (+monthSales ?? 0);
              if (salesRow && salesRow['month' + (midx) + 'Quantity'] !== undefined || salesRow && salesRow['month' + (midx + 1) + 'Quantity'] !== undefined || salesRow && salesRow['month' + (midx + 2) + 'Quantity'] !== undefined) {
                nxtthreeMonthSale = salesRow['month' + (midx + 1) + 'Quantity'] + salesRow['month' + (midx + 2) + 'Quantity'] + salesRow['month' + (midx + 3) + 'Quantity'];
              }
              nxtthreeMonthSale = nxtthreeMonthSale ?? 0;
              if (nxtthreeMonthSale == 0) {
                item['month' + midx + 'Quantity'] = null;
              } else {
                if (midx == 5) {
                  nxtthreeMonthSale = nxtthreeMonthSale/2;
                }
                else if (midx == 6) {
                  nxtthreeMonthSale = nxtthreeMonthSale;
                } else {
                  nxtthreeMonthSale = nxtthreeMonthSale / 3;
                }
                stockdays = (monthInventory / nxtthreeMonthSale) * 30;
                item['month' + midx + 'Quantity'] = stockdays == 0 ? null : Math.round(stockdays);
              }
              item.isUpdated = true;
            }

          });
          break;

      }
    });
  }

  openComments(data) {
    //console.log(data);
    const materialcode = data.data.items[0].materialCode;
    const accountCode = data.data.items[0].accountCode;
    if (materialcode && accountCode) {
      this.resetForm();
      this.loadComment(materialcode, accountCode);
    }
  }

  get f() { return this.commentForm.controls; }

  initializeFormControl() {
    this.commentForm = this._fBuilder.group({
      MaterialCode: [, [RxwebValidators.required()]],
      OACAccountCode: [, [RxwebValidators.required()]],
      Comment: ['', [RxwebValidators.required()]],
    });
  }

  loadComment(materialcode, oACAccountCode) {
    const formValue = {
      MaterialCode: materialcode,
      OACAccountCode: oACAccountCode
    };
    this.commentForm.get('MaterialCode')?.setValue(materialcode);
    this.commentForm.get('OACAccountCode')?.setValue(oACAccountCode);
    this.snsService.getPlanningComment(formValue)
      .subscribe((resp) => {
        this.commentList = resp;
        if (!this.modalService.hasOpenModals()) {
          this.modalService.open(this.commentEntryModal, { backdrop: 'static' });
        }
      });
  }

  onSubmitComments() {
    this.submitted = true;
    if (this.commentForm.invalid) {
      Swal.fire('Warning', "Please fill mandatory fields", 'warning');
      return;
    }
    var command = {
      MaterialCode: this.f.MaterialCode.value,
      OACAccountCode: this.f.OACAccountCode.value,
      Comment: this.f.Comment.value,
    }
    this.loading = true;
    this.snsService.addPlanningCommnet(command)
      .pipe()
      .subscribe({
        next: this.handleSuccess.bind(this, command.MaterialCode, command.OACAccountCode),
        error: this.handleError.bind(this)
      });
  }

  handleSuccess(materialCode, accountCode) {
    this.loading = false;
    Swal.fire('Success', "Comment added successfully", 'success');
    this.resetForm();
    this.loadComment(materialCode, accountCode);
  }

  handleError(error: any) {
    Swal.fire('Error', error.Message, 'error');
    this.loading = false;
  }

  resetForm() {
    this.commentForm.get('Comment')?.setValue('');
  }

}





