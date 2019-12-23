import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';
import { GridActionsConfig, GridColoumnConfig, GridConfiguration, CellEditConfiguration } from "@app/shared/model";
import { StaticText } from "@app/shared/constants";
import { RouterService, OrdersService, MessagesService } from "@app/shared/services";
import * as moment from 'moment';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-header-update-grid',
  templateUrl: './header-update-grid.component.html',
  styleUrls: ['./header-update-grid.component.scss']
})
export class HeaderUpdateGridComponent implements OnInit {
  public gridConfig: GridConfiguration;
  public coloumnConfig: GridColoumnConfig[];
  @Input() noDataFound: string;
  @Input() gridData: any;
  @Input() triggerSorting: any;
  @Output() onDateChange =  new EventEmitter<any>();

  constructor(private translate: TranslateService, private routerService: RouterService, 
    private orderService: OrdersService, private msgService : MessagesService) { }

  ngOnInit() {
    this.populateGridConfig();
    this.populateColoumnConfig();
  }

  /**
   * To populate Grid Configuration
   */
  public populateGridConfig = () => {
    this.gridConfig = new GridConfiguration({
      enableCellEdit: false,
      gridCls : 'table-grid table table-striped table-bordered header-update-grid',
      noRecord: () => {
        return this.noDataFound
      }
    });
  }
  /**
     * populateColoumnConfig
     */
  public populateColoumnConfig = () => {
    this.coloumnConfig = [
      new GridColoumnConfig({ name: 'orderId', title: this.translate.instant('orderId') , width : 70}),
      new GridColoumnConfig({ name: 'divisionId', title: this.translate.instant('division')  , width : 50 }),
      new GridColoumnConfig({ name: 'customerId', title: this.translate.instant('customerId')  , width : 100 , render: (item, dataIndex) => {
        return item['customer'] ? item['customer'] : '--';
      } }),
      new GridColoumnConfig({
        name: 'supplierId', render: (item, dataIndex) => {
          return item['supplier'] ? item['supplier'] : '--';
        }, title: this.translate.instant('supplier') , width : 100
      }),
      new GridColoumnConfig({
        name: 'status', title: this.translate.instant('status'), width : 80, render: (item, dataIndex) => {
          return `<div class="badge ${this.fetchStatusCls(item, dataIndex)} wrap-text">${item[dataIndex]}</div>`;
        }, requiredIcon: true
      }),
      new GridColoumnConfig({
        name: 'updatedStatus', title: this.translate.instant('Updated Status'), width : 80, render: (item, dataIndex) => {
          return item[dataIndex] ? `<div class="badge ${this.fetchStatusCls(item, dataIndex)} wrap-text">${item[dataIndex]}</div>` : '--';
        }, requiredIcon: true
      }),
      new GridColoumnConfig({
        name: 'processingDate'  , width : 130 , title: this.translate.instant('processDate'), editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({
          type: 'datepicker', defaultValue: 'MM/DD/YYYY', value: (cfg, data) => {
            cfg.cellEdit.config.showDefaultDate = data[cfg.name] ? true : false;
            return data[cfg.name] ? moment(data[cfg.name]).toDate() : '';
          }, minDate: (cfg: any, item: any) => {
            return new Date();
          }, 
          disabled: (cfg: any) => {
            return false;
          }, readOnly: () => {
            return 'readonly';
          }, change: (e: any, item: any, data: any) => {
            moment(e).format('MM/DD/YYYY') !== moment(data[item.name]).format('MM/DD/YYYY') ? this.onDateChange.emit(true) : '';
            data[item.name] = moment(e).format('MM/DD/YYYY');           
          },
          maxDate: (cfg: any, item: any) => {
            return item['deliveryDate'] && new Date(item['deliveryDate']) > new Date() ? new Date(item['deliveryDate']) :  new Date();
          }, showDefaultDate: true, subType: 'text', displayCellEdit: true,
          printErrorMsg: (cfg, i, errEl) => {
            return this.msgService.fetchMessage('processingDate', 'required');
          },
          showErrorMsg: (cfg, i, errEl) => {
            return this.gridData[i][cfg.name] == '' || this.gridData[i][cfg.name] == null;
          }    
        }) , requiredIcon: true
      }),
      new GridColoumnConfig({
        name: 'deliveryDate'  , width : 130 , title: this.translate.instant('deliveryDate'), editable: (item) => { return true; }, cellEdit: new CellEditConfiguration({
          type: 'datepicker', subType: 'text', showDefaultDate: true, displayCellEdit: true, value: (cfg, data) => {
            cfg.cellEdit.config.showDefaultDate = data[cfg.name] ? true : false;          
            return data[cfg.name] ? moment(data[cfg.name]).toDate() : '';
          }, minDate: (cfg, item) => { 
            return item['processingDate'] && new Date(item['processingDate']) > new Date() ? new Date(item['processingDate']) : new Date(); },
          maxDate: () => {
            return null;
          }, change: (e: any, item: any, data: any) => {
            moment(e).format('MM/DD/YYYY') !== moment(data[item.name]).format('MM/DD/YYYY') ? this.onDateChange.emit(true) : '';
            data[item.name] = moment(e).format('MM/DD/YYYY');            
          }, disabled: (cfg: any) => {
            return false;
          }, readOnly: () => {
            return 'readonly';
          }, printErrorMsg: (cfg, i, errEl) => {            
            return this.msgService.fetchMessage('deliveryDate', 'requiredOnly');
          },
          showErrorMsg: (cfg, i, errEl) => {     
            return this.gridData[i][cfg.name] == '' || this.gridData[i][cfg.name] == null;
          }    
        }), requiredIcon: true
      })
    ]
  }

 /**
   * fetchStatusCls
   */
  public fetchStatusCls = (item: any, dataIndex: string) => {
    let cls: string = '';
    switch (this.orderService.fetchIdFromStatus(item[dataIndex] && item[dataIndex].toLowerCase(), 'orderStatusId').toString()) {
      case '201' : cls = 'badge-primary'; break;
      case '202' : cls = 'badge-success'; break;
      case '204' : cls = 'badge-secondary'; break;
      case '203' :
      case '205' : cls = 'badge-warning'; break;
      case '206' : cls = 'badge-warning'; break;
      case '207' : cls = 'badge-danger'; break;
      case '208' : cls = 'badge-danger'; break;
      case '210' : cls = 'badge-info'; break;
      case '211' : cls = 'badge-success'; break;
      case '212' : cls = 'badge-success'; break;
      case '213' : cls = 'badge-success'; break;
      default: cls = ''; break;
    }
    return cls;
  }
}
