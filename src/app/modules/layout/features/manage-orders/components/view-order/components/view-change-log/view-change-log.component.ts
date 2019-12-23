import { OrdersService, RouterService } from '@app/shared/services';
import { Component, OnInit, Input } from '@angular/core';
import { GridConfiguration, GridColoumnConfig, CellEditConfiguration, GridActionsConfig } from "@app/shared/model";
import { StaticText } from "@app/shared/constants";
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from "@app/core/services";
import * as moment from 'moment';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-view-change-log',
  templateUrl: './view-change-log.component.html',
  styleUrls: ['./view-change-log.component.scss']
})
export class ViewChangeLogComponent implements OnInit {
  public orderDetailsData: any[];
  public id: string;
  public gridConfig: any;
  public data: any = [];
  public coloumnConfig: any;
  public detailsToBeDisplayed = [
  { label: this.translate.instant('orderId'), key: 'orderId', value: '' },
  { label: this.translate.instant('customerId'), key: 'customerId', value: '' },
  { label: this.translate.instant('supplier'), key: 'supplier', value: '' },
  { label: this.translate.instant('status'), key: 'status', value: '' }, 
  { label: this.translate.instant('createdBy'), key: 'createdBy', value: '' }];
  
  constructor(private translate : TranslateService, private orderService: OrdersService, private route: ActivatedRoute, private routerService: RouterService, private loadingService: LoaderService) {
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
 

  // view order details
  public fetchViewOrderDetails = (id: string) => {
    this.orderService.fetchOrderById(id).subscribe((data : any) => {
      this.orderDetailsData = data.status && data.status == 'FAILURE' ? [] : [data][0];
        
      this.orderDetailsData['supplier'] = this.orderDetailsData['supplier'] && this.orderDetailsData['supplierId'] ? 
      this.orderDetailsData['supplierId'] +'-'+ this.orderDetailsData['supplier'] : this.orderDetailsData['supplier'];
      
      this.orderDetailsData['customerId'] = this.orderDetailsData['customerId'] && this.orderDetailsData['customer'] ? 
      this.orderDetailsData['customerId'] +'-'+ this.orderDetailsData['customer'] : this.orderDetailsData['customerId']  ;
      
      this.data = data['items'] && data['items'].length > 0   ? data['items'] : [];
      this.loadingService.hide();
    });
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
  /**
   * formatTheTemplate
   */
  public formatTheTemplate = (cfg: any) => {
    let result: string;
    result = (cfg.key.toLowerCase().indexOf('created') > -1 && this.orderDetailsData) ? `${this.orderDetailsData['createdBy']}
   on ${moment(this.orderDetailsData['createdTimeStamp']).format('MM/DD/YYYY HH:mm')}` : (this.orderDetailsData && this.orderDetailsData[cfg.key]) ?
        this.orderDetailsData[cfg.key] : '--';
    return result;
  }

  public formatLogisticChangeData = (cfg: any) => {
    let result: string;
    result = this.orderDetailsData && this.orderDetailsData[cfg.key];
    return result === null || result === '' ? '--' : result;
  }

}
