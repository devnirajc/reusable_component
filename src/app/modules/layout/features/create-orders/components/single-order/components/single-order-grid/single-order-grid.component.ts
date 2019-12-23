import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { GridConfiguration, GridColoumnConfig, CellEditConfiguration, GridActionsConfig } from "@app/shared/model";
import { OrdersService, MessagesService, UtilsService } from "@app/shared/services";
import { LoaderService } from "@app/core/services";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-single-order-grid',
  templateUrl: './single-order-grid.component.html',
  styleUrls: ['./single-order-grid.component.scss']
})
export class SingleOrderGridComponent implements OnInit {
  @Output() deleteActionTrigger = new EventEmitter<any>();
  @Input() data: any = [];
  @Input() coloumnConfig: any;
  @Input() reset : boolean;
  @Input() gridConfig: any;
  @Input() uom: any;
  @Output() addRow = new EventEmitter<any>();
  @Output() submitEvent = new EventEmitter<any>();


  constructor(private orderService: OrdersService, private msgService: MessagesService, private translate : TranslateService, private loaderService: LoaderService, private utils: UtilsService) { }

  ngOnInit() {
    this.initializeGrid();
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (changes['reset']) {
      changes['reset'].currentValue ? this.initializeGrid() : '';
    }
  }
  /**
   * initializeGrid
   */
  public initializeGrid = () => {
    this.populateGridConfig();
    this.populateColoumnConfig();
  }
  /**
   * populateGridConfig
   */
  public populateGridConfig = () => {
    this.gridConfig = new GridConfiguration({
      displayCheckBox: false,
      enableCellEdit: true
    });
  }
  /**
   * populateColoumnConfig
   */
  public populateColoumnConfig = () => {
    this.coloumnConfig = [
      new GridColoumnConfig({ name: '', title: '#', width: 50, editable: (item) => { return false }, render: (item, col, i) => { return i + 1; } }),
      new GridColoumnConfig({
        name: 'itemNumber', title: this.translate.instant('itemNumber')
        , requiredIcon: true, width: 150, editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({
          type: 'input', blur: (e: any, item: any, cfg: any, index: number) => {
            e.target && e.target.getAttribute('dirty') ? e.target.setAttribute('dirty', "true") : '';
            e.target.value == "" ? this.fillGridObjectValues(index, {}) : this.isDuplicateRec(index) ? this.fillGridObjectValues(index, {}) : this.fetchItemsInfo(e.target.value, index, e);
            this.data[index]['itemNumber'] = e.target.value.trim();
          }, displayCellEdit: true, disabled: () => { return false; }, printErrorMsg: (cfg, i, errEl) => {
            return this.itemNumberErrorMessage(cfg, i, errEl);
          }, showErrorMsg: (cfg, i, errEl) => {
            return this.showItemNumberErrorMsg(i, (errEl && errEl.getAttribute('dirty') == "true"));
          }, maxlength : 18, subType : 'number', min: 0,
          dirty: false
        })
      }),
      new GridColoumnConfig({
        name: 'quantity', width: 100,  editable: (item) => { return true }, cellEdit: new CellEditConfiguration({
          type: 'input',         
          keyDown : (e: any, cfg: any, index: number) => {           
            this.data[index][cfg.name] = e.target.value;
            (e.keyCode === 9 && !e.shiftKey) ? index >= this.data.length-1 ? this.addNewRow() : '' : e.keyCode === 13 ? this.submitForm() : '';
          }, onInput : (e: any, item: any, cfg: any, index: number) => {            
            e.target.value == 0 ?  e.target.value = '' : '';
          },
          maxlength : 10,subType : 'number', min: 1 ,                      
          printErrorMsg: (cfg, i, errEl) => {
            return this.msgService.fetchMessage(cfg.name, 'required');
          }, showErrorMsg: (cfg, i, errEl) => {
            return this.showErrorMessage(cfg, i, (errEl && errEl.getAttribute('dirty') == "true"));
          }, displayCellEdit: true, disabled: (item: any, cfg: any, index: any) => {
            return false;
          }
        }), title: this.translate.instant('quantity'), requiredIcon: true
      }),
      new GridColoumnConfig({ name: 'uom', width: 100, editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({ type: 'input', subType: 'text', displayCellEdit: true, disabled: () => { return true; }, value: () => { return this.uom; } }), title: this.translate.instant('uom') }),
      new GridColoumnConfig({ name: 'pack', width: 100, editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({ type: 'input', subType: 'text', displayCellEdit: true, disabled: () => { return true; } }), title: this.translate.instant('pack') }),
      new GridColoumnConfig({ name: 'size', width: 100, editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({ type: 'input', displayCellEdit: true, disabled: () => { return true; } }), title: this.translate.instant('size') }),
      new GridColoumnConfig({ name: 'productDescription', width: 400, editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({ type: 'input', displayCellEdit: true, disabled: () => { return true; } }), title: this.translate.instant('description')}),
      //new GridColoumnConfig({ name: 'tixhi', width: 100, editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({ type: 'input', displayCellEdit: true, disabled: () => { return true; } }), title: 'TixHi' }),
      new GridColoumnConfig({ name: 'retailUpc', width: 150, editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({ type: 'input', subType: 'text', displayCellEdit: true, disabled: () => { return true; } }), title: this.translate.instant('upc') }),     
      new GridColoumnConfig({
        name: 'actions',
        title: 'Action', width: 100,
        actionItems: [
          new GridActionsConfig({
            btnCls: 'btn btn-outline-danger btn-sm', iconClass: 'fa fa-trash', iconTooltip: 'Delete', label: '', click: (item: any, actionCfg: any, index: number) => {
              this.deleteAction(index);
            }
          })
        ]

      })
    ]
  }
  /**
   * showItemNumberErrorMsg
   */
  public showErrorMessage = (cfg: any, i: number, dirty: boolean) => {   
    return !this.data[i][cfg.name] && this.data[i][cfg.name] == '' && dirty;
  }

  /**
   * deleteAction
   */
  public deleteAction = (i: number) => {
    let index = i ? i-1 : 0
    this.focusOnField(`quantity_${index}`);
    this.deleteActionTrigger.emit(i);
  }
  /**
   * fillGridObjectValues
   */
  public fillGridObjectValues = (index: number, obj: any) => {
    let item: any = this.coloumnConfig;
    item.forEach(element => {
      let itemObj: any = this.data[index];     
      (element['config']['name'] != 'actions' || element['config']['name'] != '' || element['config']['name'] != 'itemNumber') ? itemObj[element['config']['name']] = obj[element['config']['name']] : '';
    });
  }
  /**
   * isDuplicateRec
   */
  public isDuplicateRec = (i: number): boolean => {
    let result: boolean = false;
    this.data.forEach((element, index) => {
      result = result || (element['itemNumber'] && element['itemNumber'].trim() == this.data[i]['itemNumber'].trim() && i != index)
    });
    return result;
  }
  /**
   * fetchItemsInfo
   */
  public fetchItemsInfo = (val: string, index: number, el: any) => {
    this.orderService.productDetails(val, {}, (data) => {
      let quantity =  this.data[index]['quantity'] ?  this.data[index]['quantity'] : '';
      (data.page.totalElements == 0) ? this.noItemNumberFound(index, el): this.fillGridObjectValues(index, data.page.content[0]);
      this.data[index]['quantity'] = quantity; 
      this.data[index]['itemNumber'] = val;  
    })
  }
  
  public focusOnField = (name: string) => {
    setTimeout(() => {
      document.getElementsByName(name)[0].focus();
    }, 0);
  }
  /**
   * itemNumberErrorMessage 
   */
  public itemNumberErrorMessage = (cfg: any, i: number, el: any): string => {
    return !this.data[i][cfg.name] || this.data[i][cfg.name] == '' ? this.msgService.fetchMessage(cfg.name, 'required') : this.isDuplicateRec(i) ? this.msgService.fetchMessage(cfg.name, 'duplicate') : el.getAttribute('error');
  }
  /**
   * showItemNumberErrorMsg
   */
  public showItemNumberErrorMsg = (i: number, dirty: boolean) => {
    let result = false;
    result = !(this.data[i]['productDescription'] && this.data[i]['productDescription'] != '') && dirty;
    //document.getElementsByName(`quantity_${i}`) ? document.getElementsByName(`quantity_${i}`)[0].focus() : '';
    return result ? result : false;
  }
  /**
   * noItemNumberFound
   */
  public noItemNumberFound = (index: number, el: any) => {
    el.target.setAttribute('error', this.msgService.fetchMessage('itemNumber', 'validation'));
    this.fillGridObjectValues(index, {})
  }
  /**
   * calling add new line from parent function
   */
  public addNewRow = () => {
    this.addRow.emit();
  }

   /**
   * calling add new line from parent function
   */
  public submitForm = () => {
    this.submitEvent.emit(true);
  }

}
