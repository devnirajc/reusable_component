import { OrdersService, RouterService } from '@app/shared/services';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridConfiguration, GridColoumnConfig } from "@app/shared/model";
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from "@app/core/services";
import { TranslateService } from "@ngx-translate/core";
import { OrdersConfig } from '@app/shared/config';


@Component({
  selector: 'app-view-error-log-grid',
  templateUrl: './view-error-log-grid.component.html',
  styleUrls: ['./view-error-log-grid.component.scss']
})
export class ViewErrorLogGridComponent implements OnInit {
  @Output() sort = new EventEmitter<any>();
  public previousIconClass: string = 'fa fa-plus';
  public orderDetailsData: any[];
  public id: string;
  public gridConfig: any;
  public data: any = [];
  public coloumnConfig: any;
  constructor(private translate : TranslateService, private orderService: OrdersService, private route: ActivatedRoute, private routerService: RouterService, private loadingService: LoaderService) {
    this.id = this.route.snapshot.params.id;
  }
  public page: number = 1;
  public limit: number = 100;
  public total: number;
  public numberOfPagesOptionsToBeDispalyed: number = OrdersConfig.numberOfPagesOptionsToBeDispalyed;
  public pagesLimitArray: any = OrdersConfig.perPagesRecordsTobeDisplayed;
  public sortBy: string = 'errorCode,DESC';

  ngOnInit() {
  // this.setQueryParams();
   this.fetchViewOrderDetails(this.id);
   this.initializeGrid();
  }

  // public setQueryParams = () => {
  //   let params: any = Object.assign({}, this.searchQueryData);
  //   params['page'] = this.page;
  //   params['limit'] = this.limit;
  //   params['sortBy'] = this.sortBy;
  //   this.routerService.navigateURlQueryParams([], {
  //     relativeTo: this.route,
  //     queryParams: params,
  //     skipLocationChange: false
  //   });
  // }

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
      new GridColoumnConfig({ name: 'productId', width: 100, title: this.translate.instant('productId'), enableSorting: true, sortIndex: 'productId', sortDirection: 'ASC',
      render: (rec) => {
        return rec.productId == "0" || rec.productId == 'null' ? '--' : rec.productId;
      } }),
      new GridColoumnConfig({ name: 'attributeDesc', width: 300, title: this.translate.instant('attribute') , enableSorting: true, sortIndex: 'attribute.description', sortDirection: 'ASC'  }),
      new GridColoumnConfig({ name: 'attributeValue', width: 300, title: this.translate.instant('attributeValue'),  render: (rec) => {
        return rec.attributeValue == 'null' ? '--' : rec.attributeValue;
      }}),
      new GridColoumnConfig({ name: 'errorCode', width: 150, title: this.translate.instant('errorCode'), enableSorting: true, sortIndex: 'errorCode', sortDirection: 'ASC' }),
      new GridColoumnConfig({ name: 'errorDesc', width: 800, title: this.translate.instant('errorDescription') }),
      new GridColoumnConfig({ name: 'sourceTs', width: 300, title: this.translate.instant('dateTime'), enableSorting: true, sortIndex: 'sourceTs', sortDirection: 'ASC' }),
      new GridColoumnConfig({ name: 'sevirity', width: 10, title: this.translate.instant('severity') }),
    ];
  }

  public fetchViewOrderDetails = (id: string) => {
    let page: any = this.page == 0 ? this.page : this.page - 1;
    this.orderService.fetchErrorLogById(id, page, this.limit, this.sortBy).subscribe((data : any) => {
      this.orderDetailsData = data.status && data.status == 'FAILURE' ? [] : [data][0];
      this.data = data['page']['content'] && data['page']['content'].length > 0   ? data['page']['content'] : [];
      this.total = data && data['page'] && data['page']['totalElements'] ? data['page']['totalElements'] : 0;
      this.loadingService.hide();
    });
  }

  /**
   * triggerSorting
   */
  public triggerSorting = (colDef: any) => {
    this.fetchSortedOrders(colDef);
  }
  /**
   * fetchSortedOrders
   */
  public fetchSortedOrders = (colDef: any) => {
    this.sortBy = colDef.sortIndex + ',' + colDef.sortDirection;
    this.page = 1;
    this.fetchViewOrderDetails(this.id);
  }
   /**
   * goPrev
   */
  public goPrev = () => {
    this.page = this.page - 1;
    this.fetchViewOrderDetails(this.id);
  }
  /**
   * goNext
   */
  public goNext = () => {
    this.page = this.page + 1;
    this.fetchViewOrderDetails(this.id);
  }
  changeInperPage = (cnt: number) => {
    this.limit = cnt;
    this.page = 1;
    this.fetchViewOrderDetails(this.id);
  }

  public goPage = (i: number) => {
    this.page = i;
    this.fetchViewOrderDetails(this.id);
  }

}
