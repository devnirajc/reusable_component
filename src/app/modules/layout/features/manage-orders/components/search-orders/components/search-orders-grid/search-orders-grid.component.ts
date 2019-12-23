import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { GridActionsConfig, GridColoumnConfig, GridConfiguration } from "@app/shared/model";
import { StaticText } from "@app/shared/constants";
import { RouterService, OrdersService } from "@app/shared/services";
import { TranslateService } from "@ngx-translate/core";
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { AppConfigService } from '@app/core/services';
@Component({
  selector: 'app-search-orders-grid',
  templateUrl: './search-orders-grid.component.html',
  styleUrls: ['./search-orders-grid.component.scss']
})
export class SearchOrdersGridComponent implements OnInit {
  public gridConfig: GridConfiguration;
  public coloumnConfig: GridColoumnConfig[];
  @Input() noDataFound: string;
  @Input() gridData: any;
  @Input() allChecked: boolean;
  @Input() permissions: any;
  @Output() sort = new EventEmitter<any>();
  @Output() allSelect = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter<any>();
  @Output() navigateTo = new EventEmitter<any>();
  public stickyHeader: boolean = this._appConfigService.appSettings.manageOrders.stickyHeader; 

  constructor(private translate: TranslateService, private routerService: RouterService, 
    private orderService: OrdersService, private _appConfigService: AppConfigService) { }

  ngOnInit() {
    this.populateGridConfig();
    this.populateColoumnConfig();
  }

  /**
   * To populate Grid Configuration
   */
  public populateGridConfig = () => {
    this.gridConfig = new GridConfiguration({
      displayCheckBox: true,
      enableCellEdit: false,
      gridCls: 'table-grid table table-striped table-bordered manage-order-search-grid',
      allItemsChecked: () => {
        return this.allChecked;
      },
      noRecord: () => {
        return this.noDataFound
      },
      checkBoxDisable: (item: any) => {
        let statusId = this.orderService.fetchIdFromStatus(item['status'], 'orderStatusId');
        return !(this.permissions['canEdit'] && (statusId == '202' || statusId == '205'));
      }
    });
  }


  /**
     * populateColoumnConfig
     */
  public populateColoumnConfig = () => {
    this.coloumnConfig = [
      new GridColoumnConfig({
        name: 'divisionId',  width: 50, title: this.translate.instant('division'), render: (item, dataIndex) => {
          return item[dataIndex] ? item[dataIndex] : '--';
        }
      }),
      new GridColoumnConfig({
        name: 'customerGroup', width: 80, render: (item, dataIndex) => {
          return item[dataIndex] ? item[dataIndex] : '--';
        }, title: this.translate.instant('customerOrderGroup'), enableSorting: true, sortIndex: 'oc.cogLabel', sortDirection: 'ASC'
      }),
      new GridColoumnConfig({
        name: 'customer', width: 100, render: (item, dataIndex) => {
          return item[dataIndex] ? item[dataIndex] : '--';
        }, title: this.translate.instant('customerId'), enableSorting: true, sortIndex: 'oc.customerName', sortDirection: 'ASC'
      }),
      new GridColoumnConfig({
        name: 'supplierId', width: 100, render: (item, dataIndex) => {
          return item['supplier'] ? item['supplier'] : '--';
        }, title: this.translate.instant('supplier'), enableSorting: true, sortIndex: 'supplierId', sortDirection: 'ASC'
      }),
      new GridColoumnConfig({
        name: 'orderType', width: 50, render: (item, dataIndex) => {
          return item[dataIndex] ? item[dataIndex] : '--';
        }, title: this.translate.instant('orderType')
      }),
      new GridColoumnConfig({
        name: 'totalQty', width: 80, title: this.translate.instant('totalQuantity'), render: (item, dataIndex) => {
          return item['totalQty'] ? item['totalQty'] : '--'; 
        } , enableSorting: true, sortIndex: 'supplierOrderEnriched.totalItemQty', sortDirection: 'ASC'
      }),
      new GridColoumnConfig({
        name: 'orderId', width: 50, render: (item, dataIndex) => {
          return item[dataIndex] ? item[dataIndex] : '--';
        }, title: this.translate.instant('orderId'), enableSorting: true, sortIndex: 'orderId', sortDirection: 'ASC'
      }),
      new GridColoumnConfig({
        name: 'status', width: 80, title: this.translate.instant('status'), render: (item, dataIndex) => {
          return `<div class="badge ${this.fetchStatusCls(item, dataIndex)} wrap-text">${item[dataIndex]}</div>`;
        }
      }),
      new GridColoumnConfig({
        name: 'createdOn', width: 80, sortIndex: 'createTs', title: this.translate.instant('createdDate'), enableSorting: true, sortDirection: 'ASC',
        render: (item, dataIndex) => {
          return moment(item[dataIndex], 'YYYY-MM-DD').format(' MM/DD/YYYY');
        }
      }),
      new GridColoumnConfig({
        name: 'processingDate', width: 80, sortIndex: 'soe.scheduledProcessDate', title: this.translate.instant('processDate'), enableSorting: true, sortDirection: 'ASC',
        render: (item, dataIndex) => {
          return item[dataIndex] != null ? moment(item[dataIndex], 'YYYY-MM-DD').format(' MM/DD/YYYY') : '--';
        }
      }),
      new GridColoumnConfig({
        name: 'deliveryDate', width: 80, sortIndex: 'soe.scheduledDeliveryDate', title: this.translate.instant('deliveryDate'), enableSorting: true, sortDirection: 'ASC',
        render: (item, dataIndex) => {
          return item[dataIndex] != null ? moment(item[dataIndex], 'YYYY-MM-DD').format(' MM/DD/YYYY') : '--';
        }
      }),      
      new GridColoumnConfig({
        name: 'actions',
        title: 'Action',
        width: 70,
        actionItems: [
          new GridActionsConfig({
            btnCls: 'btn btn-outline-success btn-sm', label: '',
            iconClass: 'fa fa-eye', iconTooltip: this.translate.instant('view'), click: (item, actionCfg) => { this.navigate(`/manage-order/view-order/${item['orderId']}`); }
          }),
          new GridActionsConfig({
            btnCls: 'btn btn-outline-primary btn-sm', disable: (cfg: any, item: any) => {
              return (item.isLockedForEdit == 'Y');
            }, label: '', iconClass: 'fa fa-edit', hideBtn: (cfg: any, index: any, item: any) => {
              let statusId = this.orderService.fetchIdFromStatus(this.gridData[index]['status'], 'orderStatusId');
              return !(this.permissions['canEdit'] && (statusId == '202' || statusId == '205')) || item.isLockedForEdit == 'Y';
            }, iconTooltip: this.translate.instant('edit'), click: (item, actionCfg) => { this.navigate(`/manage-order/edit-order/${item['orderId']}`); }
          }),
        
        ]
      })
    ]
  }
  /**
   * fetchStatusCls
   */
  public fetchStatusCls = (item: any, dataIndex: string) => {
    let cls: string = '';
    switch (this.orderService.fetchIdFromStatus(item[dataIndex] && item[dataIndex].toLowerCase(), 'orderStatusId').toString()) {
      case '201': cls = 'badge-primary'; break;
      case '202': cls = 'badge-success'; break;
      case '204': cls = 'badge-secondary'; break;
      case '203':
      case '205': cls = 'badge-warning'; break;
      case '206': cls = 'badge-warning'; break;
      case '207': cls = 'badge-danger'; break;
      case '208': cls = 'badge-danger'; break;
      case '210': cls = 'badge-info'; break;
      case '211': cls = 'badge-success'; break;
      case '212': cls = 'badge-success'; break;
      case '213': cls = 'badge-success'; break;
      default: cls = 'badge-info'; break;
    }
    return cls;
  }
  /**
   * navigate
   */
  public navigate = (url) => {
    this.routerService.queryParams = this.routerService.fetchQueryParams();
    this.navigateTo.emit(url);
    //this.routerService.navigateTo(url);
  }
  /**
   * triggerSorting
   */
  public triggerSorting = (cfg: any) => {
    this.sort.emit(cfg);
  }
  /**
   * allItemsSelected
   */
  public allItemsSelected = (e: any) => {
    this.allSelect.emit(e)
  }

  public rowSelected = (e: any) => {
    this.rowSelect.emit(e);
  }
}
