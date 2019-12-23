import { OrdersService, RouterService } from '@app/shared/services';
import { Component, OnInit, Input } from '@angular/core';
import { GridConfiguration, GridColoumnConfig, EditableGridColumConfig, EditableGridConfiguration } from "@app/shared/model";
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from "@app/core/services";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-view-change-log-grid',
  templateUrl: './view-change-log-grid.component.html',
  styleUrls: ['./view-change-log-grid.component.scss']
})
export class ViewChangeLogGridComponent implements OnInit {
  public previousIconClass: string = 'fa fa-plus';
  public orderDetailsData: any[];
  public id: string;
  public gridConfig: any;
  public data: any = [];
  public logisticsdata: any = [];
  public coloumnConfig: any;
  public editableGridConfig: any;
  public logisticsColoumnConfig: any;
  public editableConfig: any = [];
  public orderlineData: any = [];
  @Input() noDataFound: string;
  @Input() gridData: any = [];
  public page: number = 1;
  public sortBy: string = 'originalProductId,DESC';
  public stickyHeader: boolean = false;
  public okButtonText: string = this.translate.instant('ok');

  constructor(private translate: TranslateService, private orderService: OrdersService, private route: ActivatedRoute, private routerService: RouterService, private loadingService: LoaderService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.fetchViewOrderDetails(this.id);
    this.initializeGrid();
  }
  /**
   * initializeGrid
   */
  public initializeGrid = () => {
    this.populateGridConfig();
    //this.populateColoumnConfig();
    this.populateLogisticsColoumnConfig();
    this.populateChangeLogLineData();
    this.populateEditableGridConfig();
  }

  public populateEditableGridConfig = () => {
    this.editableGridConfig = new EditableGridConfiguration({
      noRecord: () => {
        return this.noDataFound;
      }
    });
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
  * populateLogisticsColoumnConfig
  */
  public populateLogisticsColoumnConfig = () => {
    this.logisticsColoumnConfig = [
      new GridColoumnConfig({ name: 'scheduledProcessDate', width: 50, title: this.translate.instant('processDate') }),
      new GridColoumnConfig({ name: 'scheduledDeliveryDate', width: 50, title: this.translate.instant('deliveryDate') }),
      new GridColoumnConfig({ name: 'totalItemQty', width: 50, title: this.translate.instant('orderQuantity') }),
      new GridColoumnConfig({ name: 'totalItemWgt', width: 50, title: this.translate.instant('orderWeight') }),
      new GridColoumnConfig({ name: 'totalPalletQty', width: 50, title: this.translate.instant('palletQuantity') }),
      new GridColoumnConfig({ name: 'totalCubeVolume', width: 50, title: this.translate.instant('orderVolume') }),
      new GridColoumnConfig({ name: 'routeId', width: 50, title: this.translate.instant('routeId') }),
      new GridColoumnConfig({ name: 'orderStatusCode', width: 50, title: this.translate.instant('Status') }),
      new GridColoumnConfig({ name: 'changeReason', width: 600, title: this.translate.instant('Change Reason') }),
      new GridColoumnConfig({ name: 'userId', width: 50, title: this.translate.instant('Modified User Id') }),
      new GridColoumnConfig({ name: 'sourceTs', width: 300, title: this.translate.instant('Modified Date') })
    ];
  }

  /**
   * populateColoumnConfig
   */
  public populateColoumnConfig = () => {
    this.coloumnConfig = [
      new GridColoumnConfig({ name: 'originalProductId', width: 150, title: this.translate.instant('originalProductId') }),
      new GridColoumnConfig({ name: 'orderedItemQty', width: 50, title: this.translate.instant('originalOrderQunatity') }),
      new GridColoumnConfig({ name: 'productId', width: 100, title: this.translate.instant('ChangeProductId') }),
      new GridColoumnConfig({ name: 'adjItemQty', width: 50, title: this.translate.instant('quantity') }),
      new GridColoumnConfig({ name: 'lineStatusCode', width: 100, title: this.translate.instant('status') }),
      new GridColoumnConfig({ name: 'changeReason', width: 200, title: this.translate.instant('changeReason') }),
      new GridColoumnConfig({ name: 'userId', width: 100, title: this.translate.instant('modifierUserID') }),
      new GridColoumnConfig({ name: 'sourceTs', width: 300, title: this.translate.instant('modifiedDate') }),
    ];
  }

  /**
   * populateChangeLogLineData
   */
  public populateChangeLogLineData = () => {
    this.editableConfig = [
      new EditableGridColumConfig({
        name: 'originalProductId', title: 'Original Product Id', width: 100, type: 'text', render: (rec) => {
          return rec.originalProductId;
        }, backgroundColor: '#ffffff', rowSpan: (cfg, item, index) => {
          return this.orderlineData[item.lineNbr].length;
        }
      }),
      new EditableGridColumConfig({
        name: 'orderedItemQty', title: 'Original Quantity', width: 30, type: 'text', render: (rec) => {
          return rec.orderedItemQty;
        }, backgroundColor: '#ffffff', rowSpan: (cfg, item, index) => {
          return this.orderlineData[item.lineNbr].length;
        }
      }),
      new EditableGridColumConfig({
        name: 'adjItemQty', hasClass: 'text-left align-top', title: 'Quantity', width: 20, type: 'text', render: (rec) => {
          return rec.adjItemQty ? rec.adjItemQty : '--';
        }, backgroundColor: '#ffffff'
      }),
      new EditableGridColumConfig({
        name: 'productId', hasClass: 'text-left align-top', title: 'Change Product Id', width: 50, type: 'text', render: (rec) => {
          return rec.productId ? rec.productId : '--';
        }, backgroundColor: '#ffffff'
      }),
      new EditableGridColumConfig({
        name: 'lineStatusCode', hasClass: 'text-left align-top', title: 'Status', width: 50, type: 'text', render: (rec) => {
          return rec.lineStatusCode ? rec.lineStatusCode : '--';
        }, backgroundColor: '#ffffff'
      }),
      new EditableGridColumConfig({
        name: 'changeReason', hasClass: 'text-left align-top', title: 'Change Reason', width: 200, type: 'text', render: (rec) => {
          return rec.changeReason ? rec.changeReason : '--';
        }, backgroundColor: '#ffffff'
      }),
      new EditableGridColumConfig({
        name: 'userId', hasClass: 'text-left align-top', title: 'Modified By', width: 70, type: 'text', render: (rec) => {
          return rec.userId ? rec.userId : '--';
        }, backgroundColor: '#ffffff'
      }),
      new EditableGridColumConfig({
        name: 'sourceTs', hasClass: 'text-left align-top', title: 'Modified Date', width: 200, type: 'text', render: (rec) => {
          return rec.sourceTs ? rec.sourceTs : '--'; 
        }, backgroundColor: '#ffffff', enableSorting: true, sortIndex: 'processDate', sortDirection: 'ASC'
      })
    ]
  }

  public fetchViewOrderDetails = (id: string) => {
    this.orderService.fetchChangeLogOrderById(id).subscribe((data: any) => {
      this.orderDetailsData = data.status && data.status == 'FAILURE' ? [] : [data['page']['content']['0']['orderLineChangeLogs']] && [data['page']['content']['0']['orderChangeLogs']];

      this.data = data.page.content["0"].orderLineChangeLogs && data.page.content["0"].orderLineChangeLogs.length > 0 ? this.orderLineChangeLogData(data['page']['content']['0']['orderLineChangeLogs']) : [];

      this.logisticsdata = data.page.content["0"].orderChangeLogs && data.page.content["0"].orderChangeLogs.length > 0 ? data['page']['content']['0']['orderChangeLogs'] : [];
      this.loadingService.hide();
    });
  }

  /**
   * orderLineChangeLogData 
   */
  public orderLineChangeLogData = (data: any) => {
    let itemLevelChangeData = [];
    data.forEach((item: any) => {
      if (!this.orderlineData[item.lineNbr]) {
        this.orderlineData[item.lineNbr] = [];
      } else {
        delete item.originalProductId;
        delete item.orderedItemQty;
      }
      this.orderlineData[item.lineNbr].push(item);
      itemLevelChangeData.push(item);
    });
    return itemLevelChangeData;
  }

    /**
   * navigate
   */
  public navigate = () => {
    this.routerService.navigateURlQueryParams(['/manage-order'], {
      relativeTo: this.route,
      queryParams: (this.routerService.queryParams && Object.keys(this.routerService.queryParams.params).length) > 0 ? this.routerService.queryParams.params : '',
      skipLocationChange: false
    });
    // this.routerService.navigateTo('/manage-order');
  }
  
}
