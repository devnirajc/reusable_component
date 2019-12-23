import { DialogService } from '@app/shared/components/modal-dialog/modal-dialog.service';
import { LoaderService } from '@app/core/services';
import { OrdersService, RouterService } from '@app/shared/services';
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { GridConfiguration, GridColoumnConfig, CellEditConfiguration, GridActionsConfig } from "@app/shared/model";
import { moment } from "ngx-bootstrap/chronos/test/chain";
import { TranslateService } from "@ngx-translate/core";
import { CollapseModule } from 'ngx-bootstrap';
import { OrdersConfig } from "@app/shared/config";
import { ActivatedRoute,  } from "@angular/router";

@Component({
  selector: 'app-bulk-order-inbox',
  templateUrl: './bulk-order-inbox.component.html',
  styleUrls: ['./bulk-order-inbox.component.scss']
})
export class BulkOrderInboxComponent implements OnInit {

  @Output() deleteActionTrigger = new EventEmitter<any>();
  // @Output() sort = new EventEmitter<any>();
  public sortBy: string = 'batchId,DESC';
  public page: number = 1;
  public limit: number = 100;
  public total: number;
  public numberOfPagesOptionsToBeDispalyed: number = OrdersConfig.numberOfPagesOptionsToBeDispalyed;
  public pagesLimitArray: any = OrdersConfig.perPagesRecordsTobeDisplayed;

  public data: any = [];
  public coloumnConfig: any;
  public gridConfig: any;
  public refreshBtnCls: string = "btn btn-primary btn-sm pull-right";
  public refreshBtnTooltip: string = this.translate.instant('refresh');;
  public refreshBtnIconClass: string = "fa fa-refresh";
  public searchQueryData: any = {};
  public permissions : any;
  public queryParams: any;
  public searchParams: any = {};

  constructor(private translate : TranslateService, private cdRef : ChangeDetectorRef, private orderService: OrdersService, private loaderService: LoaderService, private dialogService: DialogService, private routerService: RouterService, private route: ActivatedRoute) { }
  

  ngOnInit() {  
    this.initializeGrid();
    this.fetchRecords();
    this.queryParams = this.routerService.fetchQueryParams();
    this.onSearchQueryParamChanges();
  }

  onSearchQueryParamChanges() {
    Object.keys(this.queryParams.params).length > 0 ? this.prePopulateFormFields(this.queryParams.params) : '';
  }

  public prePopulateFormFields = (params: any) => {
    this.searchQueryData = Object.assign({}, params);
    this.triggerSearch();
  }

   /**
   * triggerSearch
   */
  public triggerSearch = () => {
    this.prepareParams();
    this.setQueryParams();    
    this.fetchRecords();
  }

  public setQueryParams = () => {
    let params: any = {};
    this.searchQueryData['page'] = this.page;
    this.searchQueryData['pageSize'] = this.limit;   
    this.routerService.navigateURlQueryParams([], {
      relativeTo: this.route,
      queryParams: this.searchQueryData,
      skipLocationChange: false
    });
  }
  
   /**
   * fetch search records
   */
  public fetchRecords = () => {
    this.data = [];
    let searchParams=this.prepeareSearchQueryData();
    let page : any = this.page == 0 ? this.page : this.page - 1;
    this.orderService.fetchInboxRecords(searchParams,page,this.limit,this.sortBy).subscribe((resultSet: any) => {
      this.loaderService.hide();
      this.data = (resultSet && resultSet.page.content) ? resultSet.page.content : [];
      this.total = (resultSet && resultSet.page.content) ? resultSet.page.totalElements : 0;
    })
  }

  public prepeareSearchQueryData = () => {
    let requestData : any = {};
    requestData = this.searchQueryData;
    delete requestData['page'];delete requestData['pageSize'];
    return requestData;
  }
  /**
   * prepareParams
  =>  */
  public prepareParams = () => {
    this.searchParams = {};  
    Object.assign(this.searchParams, this.searchQueryData);
  }

  public ngDoCheck() {
    this.cdRef.detectChanges();
  }

  /*
   * initializeGrid
   */
  public initializeGrid = () => {
    this.populateGridConfig();
    this.populateColoumnConfig();
  }

  public fetchText() {
    return this.translate.instant('nonAuthorizedText');
  }

  /**
   * fetchBulkOrders
   */
  public fetchBulkOrders = (params: any) => {
     this.searchQueryData = params;
     this.triggerSearch();
  } 




  // /** Fill Inbox details */
  // public fillInboxDetails = () => {
  //   this.data = [];
  //   let page : any = this.page == 0 ? this.page : this.page - 1;
  //   this.orderService.fetchInboxRecords(page,this.limit,this.sortBy).subscribe((resultSet: any) => {
  //     this.loaderService.hide();
  //     this.data = (resultSet && resultSet.page.content) ? resultSet.page.content : [];
  //     this.total = (resultSet && resultSet.page.content) ? resultSet.page.totalElements : 0;
  //   })
  // }

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
      new GridColoumnConfig({ name: 'userId', width: 50, title: this.translate.instant('userId'), enableSorting: true, sortIndex: 'userId', sortDirection: 'ASC' }),
      new GridColoumnConfig({ name: 'uploadDate', width: 60, title: this.translate.instant('dateAndTime') , enableSorting: true, sortIndex: 'uploadDate', sortDirection: 'ASC', render: (item, col, i) => { return moment(item.createTs).format('MM/DD/YYYY HH:mm'); } }),
      new GridColoumnConfig({ name: 'batchId', width: 50, title:this.translate.instant('batchId'), enableSorting: true, sortIndex: 'batchId', sortDirection: 'ASC' }),
      new GridColoumnConfig({
        name: 'batchStatusId', width: 300, title: this.translate.instant('uploadStatus'), render: (item, col, i) => {
          return `      
       <div class="row"><div class="col-md-3"><b>${this.translate.instant('batchStatus')}:</b></br> ${this.fetchStatus(item, col)}</div>
       <div class="col-md-2"><b>${this.translate.instant('totalOrders')}:</b></br> ${(item.totalRowCount !== null) ? item.totalRowCount : '--'}</div>
       <div class="col-md-4"><b>${this.translate.instant('ordersValidatedSuccessfully')}:</b></br> ${(item.validCount !== null) ? item.validCount : '--'}</div>
       <div class="col-md-3"><b>${this.translate.instant('ordersWithError')}:</b></br> ${(item.errorCount !== null) ? item.errorCount : '--'}</div>      
      </div>` }
      }),
      new GridColoumnConfig({
        name: 'actions',
        title: this.translate.instant('action'), width: 60,
        actionItems: [
          new GridActionsConfig({
            btnCls: 'btn btn-outline-primary btn-sm', disable: (cfg, item) => {
              return (item.batchStatusId !== 604);
            }, iconClass: 'fa fa-check', iconTooltip: this.translate.instant('processOrder'), label: '', click: (item: any, actionCfg: any, index: number) => {
              this.dialogService.showDialog('Warning', '', '', 'Warning', 'Are you sure you want to process this order ?', 'Submit', () => {
                this.submitInboxBatch(item.batchId);
              }, 'Cancel', () => {

              });
            }
          }),
          new GridActionsConfig({
            btnCls: 'btn btn-outline-danger btn-sm', disable: (cfg, item) => {
              return (item.batchStatusId !== 604);
            }, iconClass: 'fa fa-times', iconTooltip: this.translate.instant('cancelOrder'), label: '', click: (item: any, actionCfg: any, index: number) => {
              this.dialogService.showDialog('Warning', '', '', 'Warning', 'Are you sure you want to cancel this order ?', 'Submit', () => {
                this.cancelInboxBatch(item.batchId);
              }, 'Cancel', () => {

              });
            }
          }),
          new GridActionsConfig({
            btnCls: 'btn btn-outline-info btn-sm', disable: (cfg, item) => {
              return item.errorFileId === null;
            }, iconClass: 'fa fa-download', iconTooltip: this.translate.instant('errorReport') , label: '', click: (item: any, actionCfg: any, index: number) => {
              this.downloadBatchReport(item.batchId);
            }
          })
        ]
      })
    ]
  }

  /** Submit Inbox */
  public submitInboxBatch = (batchId: any) => {
    this.orderService.submitInboxBatch(batchId)
      .subscribe((data:any) => {
        this.loaderService.hide();
        (data.success) ? this.showSuccessErrorDialogue('Success', 'Submitted Successfully') : this.showSuccessErrorDialogue('Warning', 'Error while submitting batch order')       
      });
  }

  public showSuccessErrorDialogue = (type:string, msg:string) => {
    let iconClass = (type == 'Success') ? 'fa fa-check circle-green' : 'fa fa-check circle-red';
    this.dialogService.showDialog(type, iconClass, '', type, msg, 'Ok', () => {
      this.fetchRecords();
    }, '', () => {
    });
  }


  /** Cancel Inbox */

  public cancelInboxBatch = (batchId: any) => {
    this.orderService.cancelInboxBatch(batchId)
      .subscribe((data:any) => {
        this.loaderService.hide();
        (data.success) ? this.showSuccessErrorDialogue('Success', 'Batch cancellation Successful') : this.showSuccessErrorDialogue('Warning', 'Error while cancelling batch order')       
      });
  }

  public downloadBatchReport = (batchId: any) => {
    this.orderService.downloadInboxBatchReport(batchId)
      // .subscribe(data => {
      //   this.loaderService.hide();

      // });
  }

  /**
   * fetchStatusCls
   */
  public fetchStatus = (item: any, dataIndex: string) => { 
    let name: string = '';
    switch (item[dataIndex]) {
      case 601: name = 'Validation Pending'; break;
      case 602: name = 'Validation In Progress'; break;
      case 603: name = 'Invalid File'; break;
      case 604: name = 'Validation Success'; break;
      case 605: name = 'Processing In Progress'; break;
      case 606: name = 'Cancelled'; break;
      case 607: name = 'Validation Failed'; break;
      case 608: name = 'Processing Successful'; break;
    }
    return name;
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
   * formResetReset
   */
  public formReset = (e: any) => {
    this.total = 0;
    this.data = [];
    this.searchParams = {};
    this.searchQueryData = {};
    this.routerService.navigateURlQueryParams([], {
      relativeTo: this.route,
      queryParams: this.searchQueryData,
      skipLocationChange: false
    });
    this.fetchRecords();
  }
}
