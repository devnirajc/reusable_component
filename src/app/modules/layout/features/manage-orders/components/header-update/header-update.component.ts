import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { StaticText, Messages } from "@app/shared/constants";
import { OrdersService, RouterService, MessagesService } from "@app/shared/services";
import { FormFieldConfig } from "@app/shared/model";
import { DialogService } from "@app/shared/components";
import { LoaderService } from "@app/core/services";
import * as moment from 'moment';
import { Validators, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { OrdersConfig } from "@app/shared/config";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-header-update',
  templateUrl: './header-update.component.html',
  styleUrls: ['./header-update.component.scss']
})

export class HeaderUpdateComponent implements OnInit, OnDestroy {
  formFields: any[];
  public data: any;
  public headerUpDateLabel: string = this.translate.instant('headerUpDateLabel');
  public noDataFound: string = Messages.noDataFound;
  public searchQueryParams: any = {};
  public changeReasonTouched: boolean = false;
  public updateButtonEnableDisable: boolean = true;
  public dateObjArray: any = [];
  public ordersUpdatedSuccessfully = this.translate.instant('ordersUpdatedSuccessfully');
  /**
   * DatePIcekr Config
   */
  public processDateMinDdate: any = new Date();
  public processDateMaxDdate: any = null;
  public deliveryDateMinDate: any = new Date();
  public deliveryDateMaxDdate: any = null;
  public dateBulkDafaultValue: boolean = false;
  public processDatePlaceHolder: string = this.translate.instant('processDate');;
  public deliveryDatePlaceHolder: string = this.translate.instant('deliveryDate');;

  constructor(private translate: TranslateService, private route: ActivatedRoute, private orderService: OrdersService, private routerService: RouterService, private loaderService: LoaderService,
    private ordersService: OrdersService, private dialogService: DialogService, private msgService: MessagesService, public toastr: ToastsManager, vcr: ViewContainerRef) { 
      this.toastr.setRootViewContainerRef(vcr);
     }

  ngOnInit() {
    this.orderService.changeReasonFilter = OrdersConfig.bulkUpdateContextType;
    this.ordersService.orderStatusFilter = OrdersConfig.bulkUpdateStatus;
    this.ordersService.fetchStaticValues(true);
    this.initializeGrid();
    this.initializeForm();
  }
  /**
   * onDateChange
   */

  public onDateChange = (e, dataIndex, limit) => {

    dataIndex == "processingDate" ? this.dateObjArray.includes('processingDate') ? '' : this.dateObjArray.push('processingDate') : '';
    dataIndex == "deliveryDate" ? this.dateObjArray.includes('deliveryDate') ? '' : this.dateObjArray.push('deliveryDate') : '';

    this[limit] = e;
    let dupData: any = JSON.parse(JSON.stringify(this.data));
    dupData.forEach(el => {
      el[dataIndex] = moment(e).format('MM/DD/YYYY');
      (dataIndex == "processingDate") ? moment(el[dataIndex]).diff(moment(el['deliveryDate']), 'days') > 0 ? el['deliveryDate'] = '' : '' : moment(el[dataIndex]).diff(moment(el['processingDate']), 'days') < 0 ? el['processingDate'] = '' : '';
    });
    this.resetGridData(dupData);
    this.changeReasonTouched = true;
    (this.dateObjArray.includes('deliveryDate')) || (this.dateObjArray.includes('processingDate')) ? this.updateButtonEnableDisable = false : this.updateButtonEnableDisable = true
  }
  /**
   * resetGridData= 
  =>  */
  public resetGridData = (newData) => {
    this.data = [];
    this.data = newData;
  }
  /**
   * Intializing basic grid configuration for painting th egrid
   */
  public initializeGrid = () => {
    this.data = localStorage.getItem('headerUpdateItems') ? JSON.parse(localStorage.getItem('headerUpdateItems')) : this.orderService.headerUpdate;
    this.data.length && !localStorage.getItem('headerUpdateItems') ? localStorage.setItem('headerUpdateItems', JSON.stringify(this.orderService.headerUpdate)) : '';
    //this.appendUpdatedStatusToOrder();
  }

  /**
   * initializeForm
   */
  public initializeForm = () => {
    this.formFields = [
      new FormFieldConfig({
        type: 'dropdown', defaultDisplayLabel: 'description', defaultOptionsValue: 'changeReasonId', formName: 'changeReasonId',
        defaultDropDownVal: '*' + this.translate.instant('selectChangeReason'), validation: [Validators.required],
        options: () => { return this.ordersService.changeReasons }, fieldWidthCls: 'col-lg-2 col-md-4',
        displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12",
        change: (e: any, item: any) => {
          this.changeReasonTouched = this.updateButtonEnableDisable ? false : true;
          this.populateSearchParams(e, item);
        }, hidden: () => {
          return false;
        }, errorMessages: true, isErrorMessageVisible: (item: any) => {
          return (!this.searchQueryParams['changeReasonId'] || this.searchQueryParams['changeReasonId'] == '') && this.changeReasonTouched;
        }, displayErrorMessage: (item: any) => {
          return this.msgService.fetchMessage('changeReasonId', 'required');
        }
      }),
      new FormFieldConfig({
        type: 'button', formName: '', fieldWidthCls: 'ml-auto', fieldWidth: "ml-3", btnCls: "btn btn-success", btnText: this.translate.instant('updateBtnText'), btnClick: (e) => {
          this.isDisabled() ? this.submitBatch() : '';
        }, disabled: (e) => {
          return this.updateButtonEnableDisable;
        }
      }),
      new FormFieldConfig({
        type: 'button', formName: '', fieldWidthCls: '', fieldWidth: "mr-3", btnCls: "btn btn-default mr-3", btnText: this.translate.instant('cancelBtnText'), btnClick: (e) => {
          this.navigateToManageOrders();
          this.orderService.headerUpdate = [];
        }
      })
    ]
  }

  public isDisabled = () => {
    return this.gridValidation() && this.searchQueryParams && this.searchQueryParams['changeReasonId'];
  }
  /**
   * submitBatch 
   */
  public submitBatch = () => {
    let paramData: any[] = this.prepareParams();
    this.orderService.patchBulkOrder(paramData).subscribe(data => {
      this.orderService.headerUpdate = [];
      this.loaderService.hide();
      this.showSuccess();
    });
  }

  public showSuccess = () => {
    this.toastr.success(this.ordersUpdatedSuccessfully)
          .then((toast: any) => {
              setTimeout(() => {
                  this.toastr.dismissToast(toast);
                  this.navigateToManageOrders();
              }, 2000);
      });
  }


  public navigateToManageOrders = () => {
    this.routerService.navigateURlQueryParams(['/manage-order'], {
      relativeTo: this.route,
      queryParams: (this.routerService.queryParams && Object.keys(this.routerService.queryParams.params).length) > 0 ? this.routerService.queryParams.params : '',
      skipLocationChange: false
    });
  }

  public prepareParams = (): any => {
    let filteredData: any = [];
    this.data.forEach(element => {
      let itemObj: any = {};
      itemObj['orderId'] = element['orderId'];
      itemObj['processingDate'] = (element['processingDate']) ? element['processingDate'] : '';
      itemObj['deliveryDate'] = (element['deliveryDate']) ? element['deliveryDate'] : '';
      itemObj['orderStatusId'] = (element['updatedStatus']) ? this.orderService.fetchIdFromStatus(element['updatedStatus'], 'orderStatusId') : this.orderService.fetchIdFromStatus(element['status'], 'orderStatusId');
      itemObj['changeReasonId'] = (this.searchQueryParams['changeReasonId']) ? this.searchQueryParams['changeReasonId'] : element['changeReasonId'];
      filteredData.push(itemObj);
    });
    return filteredData;
  }
  /**
   * populateSearchParams
   */
  public populateSearchParams = (val: any, cfg: any) => {
    (val != '' && val != cfg.defaultValue) ? this.searchQueryParams[cfg.formName] = val : (this.searchQueryParams[cfg.formName]) ? delete this.searchQueryParams[cfg.formName] : '';
  }

  public onStatusChange = (e: any) => { 
    let dupData: any = JSON.parse(JSON.stringify(this.data));
    dupData.forEach(el => {
      let statusId = this.orderService.fetchIdFromStatus(el['status'], 'orderStatusId');
      el['updatedStatus'] = e == '' ? '--' : OrdersConfig.editOrderStatus[statusId].indexOf(Number(e)) > -1 ? this.ordersService.fetchStatusFromId(e, 'description') : '--'; 
    });
    this.resetGridData(dupData);
    this.searchQueryParams['status'] = e;
    this.changeReasonTouched = true;
    this.searchQueryParams['status'] ? this.updateButtonEnableDisable = false : ((this.dateObjArray.includes('deliveryDate')) || (this.dateObjArray.includes('processingDate'))) ? this.updateButtonEnableDisable = false : this.updateButtonEnableDisable = true;
    ;
  }

  /**
  * checkGridValues
  */
  public gridValidation = () => {
    let result = true;
    if (this.data) {
      this.data.forEach(el => {
        result = result && el.processingDate != '' && el.processingDate != null && el.deliveryDate != '' && el.processingDate != null;
      });
    };
    return result;
  }

  public changeDate = (e:any) => {
    this.updateButtonEnableDisable = false;
    this.changeReasonTouched = true;
  }

  ngOnDestroy() {
    localStorage.removeItem('headerUpdateItems');
    this.ordersService.orderStatusFilter = [];
    this.orderService.changeReasonFilter = [];
  }
}