import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Messages } from "@app/shared/constants";
import { OrdersService, MessagesService, RouterService, ToasterService } from "@app/shared/services";
import { LoaderService, AppConfigService } from "@app/core/services";
import { OrdersConfig } from "@app/shared/config";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime } from 'rxjs/operators';
import * as $ from 'jquery'

@Component({
  selector: 'app-search-orders',
  templateUrl: './search-orders.component.html',
  styleUrls: ['./search-orders.component.scss']
})

export class SearchOrdersComponent implements OnInit, OnDestroy {
  public data: any = [];
  public form: any;
  public appendZero: any = ' 00:00';
  public selectedRecords: any = [];
  public formFields: any = [];
  public noDataFound: string = this.translate.instant('searchQuery');
  public headerUpdate: string = this.translate.instant('headerUpDateLabel');
  public exportcsvReport: string = this.translate.instant('exportcsvReport');
  public csvReportCls: string = 'btn btn-primary btn-sm p-1 mt-2 float-right';
  public headerUpdateCls: string = 'btn btn-primary';
  public searchParams: any = {};
  public page: number = 1;
  public limit: number = 100;
  public totalThrushHold: number = 1000;
  public infiniteScrollEnable: boolean = false; 
  public defaultStatus: number = 202;
  public total: number;  
  public sortBy: string = 'orderId,DESC';
  public showLoader: boolean = false; 

  public searchQueryData: any = {};
  public numberOfPagesOptionsToBeDispalyed: number = OrdersConfig.numberOfPagesOptionsToBeDispalyed;
  public pagesLimitArray: any = OrdersConfig.perPagesRecordsTobeDisplayed;
  public allChecked: boolean = false;
  public displayErrMessage: string;
  public displayErr: boolean = false;
  public supplierObj: any = [];
  public queryParams: any;
  public permissions: any = [];
  public stoppedScrolling: boolean = false;
  
  constructor(private translate: TranslateService, private route: ActivatedRoute, private router: Router, private cdRef: ChangeDetectorRef, private routerService: RouterService,
    private msgService: MessagesService, private ordersService: OrdersService, private toaster: ToasterService,
    private loadingService: LoaderService, private _appConfigService: AppConfigService) {
      this.setDefaultConfigs();
    }

  ngOnInit() { 
    this.ordersService.orderStatusFilter = OrdersConfig.manageOrderStatus;
    this.ordersService.fetchStaticValues(true);  
    this.setDefaultInitialization();   
  }

  public ngDoCheck() {
    this.cdRef.detectChanges();
  }

  public setDefaultConfigs() {
    let appSettings = this._appConfigService.appSettings.manageOrders;   
    this.limit = appSettings.limit ? appSettings.limit : this.limit;
    this.totalThrushHold = appSettings.threshhold ? appSettings.threshhold : this.totalThrushHold;
    this.infiniteScrollEnable = appSettings.infiniteScrolling ? appSettings.infiniteScrolling : this.infiniteScrollEnable;
    this.defaultStatus = appSettings.defaultStatus ? appSettings.defaultStatus : this.defaultStatus;
  }

  public setDefaultInitialization = () => {   
    localStorage.removeItem('headerUpdateItems');   
    this.initializeGrid();
    this.queryParams = this.routerService.fetchQueryParams();  
    (Object.keys(this.queryParams.params).length > 0) ? this.prefillGridData() : this.setDefaultValuesToFilter();
  }

  public setDefaultValuesToFilter = () => {  
    let queryObj = Object.assign({}, this.queryParams.params);
    Object.keys(queryObj).length > 0 ? '' : queryObj.orderStatusId = this.defaultStatus;
    this.queryParams.params = this.searchQueryData = queryObj;
    this.fetchOrders();
  }
  /**getOrdersList
   * Intializing basic grid configuration for painting th egrid
   */
  public initializeGrid = () => {
    this.populateGridData();
  }
  /**
   * populateGridData
   */
  public populateGridData = () => {
    this.data = [];
  }
  /**
   * prefillGridData
   */
  public prefillGridData = () => {      
    this.searchQueryData = this.deleteKeysInSearchQueryData();   
    Object.keys(this.queryParams.params).length > 0 ? this.fetchOrders() : '';
  }    

  public deleteKeysInSearchQueryData = () => {
    let queryData = Object.assign([], this.queryParams.params);
    delete queryData['page'];
    delete queryData['pageSize'];
    delete queryData['sortBy'];
    return queryData;
  }
  /**
   * fetchOrders
   */
  public fetchOrders = () => {
    this.defaultGridData();
    this.prepareParams();
    this.displayErr = false;
    this.setQueryParams();
    this.getOrdersList();
  }

  public triggerGridSearch = (params: any) => {
    this.data = [];
    this.searchQueryData = params;
    this.selectedRecords = [];
    this.ordersService.headerUpdate = [];
    this.page = 1;
    this.sortBy = 'orderId,DESC';
    this.triggerSearch();
  }
  /**
   * triggerSearch
   */
  public triggerSearch = () => {
    this.fetchOrders();
  }

  public defaultGridData = () => {
    this.allChecked = false;
    this.displayGridErrorMessage('');
  }

  public defaultPaginationParams = () => {
    if(!this.infiniteScrollEnable){
      this.page = this.searchQueryData && this.searchQueryData['page'] ? Number(this.searchQueryData['page']) : this.page;
      this.limit = this.searchQueryData && this.searchQueryData['limit'] ? Number(this.searchQueryData['limit']) : this.limit;
    }   
    this.sortBy = this.searchQueryData && this.searchQueryData['sortBy'] ? this.searchQueryData['sortBy'] : this.sortBy;
  }
  /**
   * prepareParams
  =>  */
  public prepareParams = () => {
    this.searchParams = {};
    Object.assign(this.searchParams, this.searchQueryData);
    this.performDateMapping();
  }
  /**
   * performDateMapping
   */
  public performDateMapping = () => {
    if (this.searchParams['dateColumn']) {
      switch (this.searchParams['dateColumn'].toLowerCase()) {
        case 'createts': this.searchParams['createdDateFrom'] = this.searchQueryData['startDate'] + `${this.appendZero}`;
          this.searchParams['createdDateTo'] = this.searchQueryData['endDate'] + `${this.appendZero}`; break;
        case 'scheduledreleasedate': this.searchParams['processingDateFrom'] = this.searchQueryData['startDate']; this.searchParams['processingDateTo'] = this.searchQueryData['endDate']; break;
        case 'scheduleddeliverydate': this.searchParams['deliveryDateFrom'] = this.searchQueryData['startDate']; this.searchParams['deliveryDateTo'] = this.searchQueryData['endDate']; break;
      }
      delete this.searchParams['dateColumn'];
      delete this.searchParams['startDate'];
      delete this.searchParams['endDate'];
    }
  }
  /**
   * getOrdersList
   */
  public getOrdersList = () => {
    this.showLoader = true;
    let page: any = this.page == 0 ? this.page : this.page - 1;
    this.ordersService.fetchOrder(this.searchParams, page, this.limit, this.sortBy, this.infiniteScrollEnable)
    .pipe(debounceTime(200))
    .subscribe(data => {
      this.loadingService.hide();
      this.showLoader = false;
      let content = data && data['page'] && data['page']['content'] ? data['page']['content'] : [];
      this.data = this.prepareGridData(content);
      this.total = data && data['page'] && data['page']['totalElements'] ? data['page']['totalElements'] : 0;
      this.checkIfAPIResultExist(content);     
      this.displayGridErrorMessage((this.data.length === 0) ? Messages.noDataFound : '');
    }, err => {
      this.data = this.infiniteScrollEnable ? this.data : [];
      this.displayGridErrorMessage(Messages.searchError.serverError);
    });
  }

  prepareGridData = (content : any) => {
    return this.infiniteScrollEnable ? [...this.data , ...content] : content;
  }

  public checkIfAPIResultExist = (data: any) => {
    this.stoppedScrolling = data.length == 0 || data.length < this.limit ? true : false;
    !this.infiniteScrollEnable ? $("html, body").animate({ scrollTop: 0 }, "slow") : '';
  }
  

  public setQueryParams = () => {
    let params: any = Object.assign({}, this.searchQueryData);
    this.setPaginationParams(params);
    this.routerService.navigateURlQueryParams([], {
      relativeTo: this.route,
      queryParams: params,
      skipLocationChange: false
    });
  }

  public setPaginationParams = (params: any) => {
    !this.infiniteScrollEnable ? params['page'] = this.page : '';
    !this.infiniteScrollEnable ? params['pageSize'] = this.limit : '';
    params['sortBy'] = this.sortBy;  
  }


  /**
   * displayGridErrorMessage
   */
  public displayGridErrorMessage = (msg) => {
    this.noDataFound = msg;
  }

  /**
   * navigateToHeaderUpdate
   */
  public navigateToHeaderUpdate = () => {
    this.routerService.queryParams = this.routerService.fetchQueryParams();
    this.navigateTo('/manage-order/bulk-update');
  }
  /**
   * Navigate to a url
   * while doing so will save the search params in our service so that when the user cancels the following opreartion and ocmes back it will be maintian the state
   */
  public navigateTo = (url) => {
    this.routerService.navigateTo(url);
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
    this.data = [];
    this.sortBy = colDef.sortIndex + ',' + colDef.sortDirection;
    this.page = 1;
    this.triggerSearch();
  }
  /**
   * goPrev
   */
  public goPrev = () => {
    this.page = this.page - 1;
    this.triggerSearch();
  }
  /**
   * goNext
   */
  public goNext = () => {
    this.page = this.page + 1;
    this.triggerSearch();
  }
  
  changeInperPage = (cnt: number) => {
    this.limit = cnt;
    this.page = 1;
    this.triggerSearch();
  }

  public goPage = (i: number) => {
    this.page = i;
    this.triggerSearch();
  }
  /**
   * allItemsSelected
   */
  public allItemsSelected = (e: any) => {
    this.selectedRecords = [];
    this.ordersService.headerUpdate = [];
    this.data.forEach(element => {
      (this.permissions['canEdit'] && (element.status.toLowerCase() === 'active' || element.status.toLowerCase() === 'hold')) ? this.pushDataInHeaderUpdate(element, e.target.checked) : '';
    });
  }

  public pushDataInHeaderUpdate = (el: any, check: boolean) => {
    let orderObj: any = {};
    let allowedFields = ['orderId', 'supplier', 'customer', 'divisionId', 'deliveryDate', 'processingDate', 'status', 'customerId', 'supplierId'];
    allowedFields.forEach(fieldName => {
      el[fieldName] ? orderObj[fieldName] = el[fieldName] : '';
    });
    (check) ? this.selectedRecords.push(el) : '';
    el.selected = check;
    this.ordersService.headerUpdate = this.selectedRecords;
    this.isAllChecked();
  }
  /**
   * rowSelected
   */
  public rowSelected = (e: any) => {
    let el: any = e[2].target.checked;
    let item: any = e[0];
    let index: any = e[1];
    (!el) ? this.removeFromSelected(item) : this.pushDataInHeaderUpdate(item, el);
  }

  public getSelectedIndex = (it: any) => {
    let index: any = '';
    this.selectedRecords.forEach((data, i) => {
      index = (data.orderId === it.orderId && index == '') ? i : index;
    });
    return index;
  }

  public removeFromSelected = (it: any) => {
    let index: any = this.getSelectedIndex(it);
    (index >= 0) ? this.selectedRecords.splice(index, 1) : '';
    it.selected = false;
    this.ordersService.headerUpdate = this.selectedRecords;
    this.isAllChecked();
  }
  
  public isAllChecked = () => {
    this.allChecked = this.ordersService.headerUpdate.length === this.data.length;
  }
  /**
   * formResetReset
   */
  public formReset = (e: any) => {
    this.total = 0;
    this.data = [];
    this.searchParams = {};
    this.searchQueryData = {};
    this.page = 1;
    this.limit = this.limit;
    this.setQueryParams();
    this.displayGridErrorMessage(this.translate.instant('searchQuery'));
  }

  public ngOnDestroy = () => {
    this.ordersService.orderStatusFilter = [];
  }

  public checkReport = () => {
    this.checkIfRequiredeFieldhasValue() ? this.getReport() : !this.searchParams.bic ? this.toaster.showInfo('Please search result to download CSV report', '', 3000) : '';
  }

  downloadFile(data: any, filename: any) {
    var ieEDGE = navigator.userAgent.match(/Edge/g);
    var ie = navigator.userAgent.match(/.NET/g); // IE 11+
    var oldIE = navigator.userAgent.match(/MSIE/g);
    var blob = new window.Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    if (ie || oldIE || ieEDGE) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      link.target = '_self';
      link.href = url;
      link.download = filename;
      link.setAttribute('visibility', 'hidden');
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  public checkIfRequiredeFieldhasValue = (): boolean => {
    let checkFieldObj = Object.assign({}, this.searchQueryData);
    delete checkFieldObj['page'];   delete checkFieldObj['limit'] ;   delete checkFieldObj['sortBy'];
    return  this.searchQueryData.bic ? this.searchQueryData.supplierId && this.searchQueryData.supplierId != '' : Object.keys(checkFieldObj).length > 0;
  }

   /**
   * getReport
   */
  public getReport = () => {
    let filename: string;
    let page: any = this.page == 0 ? this.page : this.page - 1;
    this.ordersService.downloadOrderReport(this.searchParams, page, this.limit, this.sortBy).subscribe(data => {
      this.loadingService.hide();
      let contentDisposition = data.headers.get('content-type')
      filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
      this.downloadFile(data.body, filename);
    }, err => {
    });
  }

  public scrollEvent = () => {
    this.data.length < this.totalThrushHold && this.infiniteScrollEnable ? this.goNext() : '';
  }

  public loadMoreData = () => {
    this.data = [];
    this.goNext();
  }
}
