import { EndPoints } from './../../constants/endPoints';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoaderService, AppConfigService } from "@app/core/services";
import { Router } from '@angular/router';

@Injectable()
export class OrdersService {
  private _orderTypeOptions: any = [];
  private _scheduleIdOptions: any = [];
  private _orderTypeAssoction: any = [];
  private _transferTypeOptions: any = [];
  private _orderTypeStatus: any = [];
  private _allOrderStatus: any = [];
  private _allOrderTypes: any = [];
  private _datesTypes: any = [];
  private _divisionTypes: any = [];
  private _customerTypes: any = [];
  private _headerUpdate: any = [];
  private _changeReasons: any = [];
  private _orderAllocationTypes: any = [];
  private _excludeStandingOrderType: any = [];
  private _orderStatusFilter: any = [];
  private _orderTypeFilter: any = [];
  private _changeReasonFilter: any = [];
  private _changeReasonOptions: any = [];
  private _physicalWarehouse: any = [];
  private _processDayTypes: any = [];
  private _totalQuantityDropdown: any = [];
  // API URLS
  private baseUrl = this.appConfiguration.appConfig.orderProcessorBaseUrl;
  private batchBaseUrl = this.appConfiguration.appConfig.batchProcessorBaseUrl;
  private supplierBaseUrl = this.appConfiguration.appConfig.supplierMasterBaseUrl;
  private customerBaseUrl = this.appConfiguration.appConfig.customerMasterBaseUrl;
  private productBaseUrl = this.appConfiguration.appConfig.productMasterBaseUrl;
  private customerOrderProcessorUrl = this.appConfiguration.appConfig.customerOrderProcessorUrl;
  private productSupplierBaseUrl = this.appConfiguration.appConfig.productSupplierMasterUrl;
  private productCustomerBaseUrl = this.appConfiguration.appConfig.productCustomerMasterUrl;
  private supplierOrderProcessorUrl = this.appConfiguration.appConfig.supplierOrderProcessorUrl;
  private bohMasterBaseUrl = this.appConfiguration.appConfig.inventoryMasterUrl;
  private changeLogBaseUrl = this.appConfiguration.appConfig.changeLogBaseUrl;
  private errorLogBaseUrl = this.appConfiguration.appConfig.errorLogBaseUrl;

  private getItemDetailsUrl = `${this.baseUrl}/${EndPoints.orderChildUrlPath.itemPath}/`;
  private fetchOrderTypesUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.orderTypesPath}/`;
  private fetchOrderStatusUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.orderStatusPath}/`;
  private uploadBulkOrderUrl = `${this.batchBaseUrl}/${EndPoints.batchChildUrlPath.bulkUpload}`;
  private submitInboxBatchUrl = `${this.batchBaseUrl}/${EndPoints.batchChildUrlPath.singleBatch}/`;
  private cancelInboxBatchUrl = `${this.batchBaseUrl}/${EndPoints.batchChildUrlPath.singleBatch}/`;
  private downloadInboxBatchUrl = `${this.batchBaseUrl}/${EndPoints.batchChildUrlPath.singleBatch}/`;
  private fetchInboxRecordsUrl = `${this.batchBaseUrl}/${EndPoints.batchChildUrlPath.getAllBatches}`;
  private fetchChangeReasonsUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.changeReasonPath}`;
  private fetchChangeReasonsUrlV2 = `${this.changeLogBaseUrl}${EndPoints.changeLogPathUrl.auditChangeReasonPath}`;
  private fetchLineStatus = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.lineStatus}`;
  private createSingleOrderUrl = `${this.customerOrderProcessorUrl}/${EndPoints.orderChildUrlPath.orderPath}`;
  private viewOrderDetailsUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.searchPath}`;
  private fetchOrderUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.orderSearchPath}`;
  private downloadOrderReportUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.downloadManageOrderSearchReport}`;
  private updateOrdersUrl = `${this.baseUrl}/${EndPoints.orderChildUrlPath.updatePath}`;
  private patchOrderUpdateUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.manageBulkOrders}`;
  private manageSingleUpdateUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.manageSingleOrder}`;
  private fetchOrderByIdUrl = `${this.supplierOrderProcessorUrl}/${EndPoints.orderChildUrlPath.manageOrder}`;
  private getSupplierDetailsUrl = `${this.supplierBaseUrl}/${EndPoints.supplierMasterChildUrlPath.suppliers}`;
  private getCustomerDetailsUrl = `${this.customerBaseUrl}/${EndPoints.customerMasterUrlPath.customers}`;
  private getCustomerGroupDetailsUrl = `${this.customerBaseUrl}/${EndPoints.groupAssociationChildUrlPath.groupCreate}`;
  private getProductUrl = `${this.productBaseUrl}/${EndPoints.productMasterChildPathUrl.products}`;
  private getProductSupplierUrl = `${this.productSupplierBaseUrl}/${EndPoints.productMasterChildPathUrl.products}`;
  private getProductCustomerUrl = `${this.productCustomerBaseUrl}/${EndPoints.productMasterChildPathUrl.products}`;
  private bohMasterUrl = `${this.bohMasterBaseUrl}/${EndPoints.inventoryBohPath.fetchBOH}`;
  private download_endpoint = `${EndPoints.batchChildUrlPath.templateDownloadUrl}`;
  private fetchChangeLogOrderByIdUrl = `${this.changeLogBaseUrl}${EndPoints.changeLogPathUrl.fetchInfo}`;
  private fetchErrorLogDetails = `${this.errorLogBaseUrl}${EndPoints.errorLogPathUrl.fetchBySupplierOrderId}`;
  private getCustomerReleaseGroupUrl = `${this.customerBaseUrl}/${EndPoints.groupAssociationChildUrlPath.releaseGroupSearch}`;
  private fetchSupplierDepartment =  `${this.productBaseUrl}/${EndPoints.orderChildUrlPath.supplierDeptartment}`;
  private fetchCustomerTypesUrl = `${this.customerBaseUrl}/${EndPoints.customerMasterUrlPath.retrieveCustomerTypes}`;
  private headers = new HttpHeaders();

  get changeReasons(): any {
    return this._changeReasons;
  }
  set changeReasons(items: any) {
    this._changeReasons = items;
  }
  get headerUpdate(): any {
    return this._headerUpdate;
  }
  set headerUpdate(items) {
    this._headerUpdate = items;
  }
  get orderTypeOptions(): any {
    return this._orderTypeOptions;
  }
  set orderTypeOptions(options: any) {
    this._orderTypeOptions = options;
  }
  get scheduleIdOptions(): any {
    return this._scheduleIdOptions;
  }
  set scheduleIdOptions(options: any) {
    this._scheduleIdOptions = options;
  }
  get orderTypeAssoction(): any {
    return this._orderTypeAssoction;
  }
  set orderTypeAssoction(options: any) {
    this._orderTypeAssoction = options;
  }
  get orderTypeStatus(): any {
    return this._orderTypeStatus;
  }
  set divisionTypes(options: any) {
    this._divisionTypes = options;
  }
  get divisionTypes(): any {
    return this._divisionTypes;
  }
  set processDayTypes(options: any) {
    this._processDayTypes = options;
  }
  get processDayTypes(): any {
    return this._processDayTypes;
  }
  set physicalWarehouse(options: any) {
    this._physicalWarehouse = options;
  }
  get physicalWarehouse(): any {
    return this._physicalWarehouse;
  }
  set customerTypes(options: any) {
    this._customerTypes = options;
  }
  get customerTypes(): any {
    return this._customerTypes;
  }
  get datesTypes(): any {
    return this._datesTypes;
  }
  set datesTypes(options: any) {
    this._datesTypes = options;
  }
  set orderTypeStatus(options: any) {
    this._orderTypeStatus = options;
  }
  get transferTypeOptions(): any {
    return this._transferTypeOptions;
  }
  set transferTypeOptions(options: any) {
    this._transferTypeOptions = options;
  }

  get orderAllocationTypes(): any {
    return this._orderAllocationTypes;
  }

  set orderAllocationTypes(options: any) {
    this._orderAllocationTypes = options;
  }

  get excludeStandingOrderType(): any {
    return this._excludeStandingOrderType;
  }

  set excludeStandingOrderType(options: any) {
    this._excludeStandingOrderType = options;
  }

  get orderStatusFilter(): any {
    return this._orderStatusFilter;
  }

  set orderStatusFilter(options: any) {
    this._orderStatusFilter = options;
  }

  get changeReasonFilter(): any {
    return this._changeReasonFilter;
  }

  set changeReasonFilter(options: any) {
    this._changeReasonFilter = options;
  }

  get allOrderStatus(): any {
    return this._allOrderStatus;
  }

  set allOrderStatus(options: any) {
    this._allOrderStatus = options;
  }

  get orderTypeFilter(): any {
    return this._orderTypeFilter;
  }

  set orderTypeFilter(options: any) {
    this._orderTypeFilter = options;
  }

  get allOrderTypes(): any {
    return this._allOrderTypes;
  }

  set allOrderTypes(options: any) {
    this._allOrderTypes = options;
  }

  get totalQuantityDropdown(): any {
    return this._totalQuantityDropdown;
  }

  set totalQuantityDropdown(options: any) {
    this._totalQuantityDropdown = options;
  }


  /**
   * fetchDates Allocation typeTypes
   */
  public fetchAllocationTypes = () => {
    this.orderAllocationTypes = [{
      label: 'Allocation Down',
      value: 'Down'
    }, {
      label: 'Allocation Up',
      value: 'Up'
    }]
  }


  constructor(private _http: HttpClient, private loaderService: LoaderService, private router: Router, private appConfiguration: AppConfigService) {
    this.headers = this.headers.append(
      'DoNotIntercept',
      'true'
    );

  }

  public getSupplierInfo = (id: string) => {
    let url = "./assets/json/customerList.json";
    return this._http.get(url);
    // return this._http.get(`order/item/${id}`);
  }

  /**
   * getItemDetails
   */
  public getItemDetails = (val: string) => {
    return this._http.get(this.getItemDetailsUrl + `${val}`);
  }

  public fetchOrderTypes = () => {
    return this._http.get(this.fetchOrderTypesUrl, {headers: this.headers});
  }

  /**
   * fetchCustomerTypes
   */
  public fetchCustomerTypes = () => {
    return this._http.get(this.fetchCustomerTypesUrl, {headers: this.headers});
  }

  /**
   * fetchOrderStatus
   */
  public fetchOrderStatus = () => {
    return this._http.get(this.fetchOrderStatusUrl, {headers: this.headers});
  }

  /** Upload Bulk Order */
  public uploadBulkOrder = (param: any) => {
    return this._http.post(this.uploadBulkOrderUrl, param);
  }

  /** Submit Inbox batch */
  public submitInboxBatch = (batchId: any) => {
    return this._http.post(this.submitInboxBatchUrl + batchId + '/process', batchId);
  }
  public updateOrder = (params) => {
    return this._http.post(`${this.baseUrl}${EndPoints.orderChildUrlPath.update}`, params)
  }
  /** Cancel Inbox batch */
  public cancelInboxBatch = (batchId: any) => {
    return this._http.patch(this.cancelInboxBatchUrl + batchId + '/cancel', batchId);
  }
  /** Download Inbox batch report*/
  public downloadInboxBatchReport = (batchId: any) => {
    let blob = new Blob([`${this.downloadInboxBatchUrl}${batchId}/download`]);
    if (window.navigator.msSaveOrOpenBlob) {
      window.open(`${this.downloadInboxBatchUrl}${batchId}/download`, "BatchErrorFile.txt");
    }
    else {
      const link = document.createElement('a');
      link.target = '_self';
      link.href = `${this.downloadInboxBatchUrl}${batchId}/download`;
      link.setAttribute('visibility', 'hidden');
      link.click();
    }
  }

  /**
   * fetchInboxRecords
   */
  public fetchInboxRecords = (params: any, page: number, limit: number, sortBy: string) => {
    let url: string = `${this.fetchInboxRecordsUrl}?page=${page}&size=${limit}&sort=${sortBy}`;
    return this._http.post(url, params);
  }

  public fetchChangeReasons = () => {
    return this._http.get(this.fetchChangeReasonsUrlV2,{headers: this.headers});
  }
  /**
   * fetchTransferTypes
   */
  public fetchTransferTypes = () => {
    this.transferTypeOptions = [{
      label: 'M2 - Inter-division transfer',
      value: 'M2'
    }, {
      label: 'M3 - Expense',
      value: 'M3'
    }, {
      label: 'M9 - Intra-division transfer',
      value: 'M9'
    }]
  }
  /**
   * fetchDatesTypes
   */
  public fetchDatesTypes = () => {
    this.datesTypes = [{
      label: 'Create Date',
      value: 'createTs'
    }, {
      label: 'Process Date',
      value: 'scheduledReleaseDate'
    }, {
      label: 'Delivery Date',
      value: 'scheduledDeliveryDate'
    }]
  }
  /**
  * fetchScheduleId
  */
  public fetchScheduleId = () => {
    this.scheduleIdOptions = [{
      label: '3031',
      value: '3031'
    }, {
      label: '3132',
      value: '3132'
    }, {
      label: '3133',
      value: '3133'
    }, {
      label: '3333',
      value: '3333'
    }, {
      label: '3434',
      value: '3434'
    }]
  }
  /**
   * fetchDivisionTypes
   */
  public fetchDivisionTypes = () => {
    this.divisionTypes = [{
      label: '30',
      value: '30'
    }, {
      label: '31',
      value: '31'
    }, {
      label: '32',
      value: '32'
    }, {
      label: '33',
      value: '33'
    }, {
      label: '34',
      value: '34'
    }]
  }

  public fetchProcessDays = () => {
    this.processDayTypes = [{
      label: 'Su',
      value: 'Sun'
    }, {
      label: 'Mo',
      value: 'Mon'
    }, {
      label: 'Tu',
      value: 'Tue'
    }, {
      label: 'We',
      value: 'Wed'
    }, {
      label: 'Th',
      value: 'Thu'
    }, {
      label: 'Fr',
      value: 'Fri'
    }, {
      label: 'Sa',
      value: 'Sat'
    }
    ]
  }

  /**
   * fetchphysicalWarehouse
   */
  public fetchphysicalWarehouse = () => {
    this.physicalWarehouse = [{
      label: 'ALL',
      value: 'ALL'
    }, {
      label: '2222',
      value: '2222'
    }, {
      label: '3333',
      value: '3333'
    }, {
      label: '3322',
      value: '3322'
    }, {
      label: '3444',
      value: '3444'
    }]
  }

  /**
   * fetchOrderTypeAssociation
   */
  public fetchOrderTypeAssociation = () => {
    this.orderTypeAssoction = [
      {
        label: 'ALL',
        value: 'ALL'
      }, {
        label: 'Regular',
        value: 'Regular'
      }, {
        label: 'Seperate',
        value: 'Seperate'
      }]
  }

  /**
   * fetchStaticValues
   */
  public fetchStaticValues = (forceLoad?: boolean) => {
    forceLoad = forceLoad ? forceLoad : false;
    (this.orderTypeOptions.length === 0 || forceLoad) ? this.fetchOrderTypes().subscribe(el => {
      this.loaderService.hide();
      this.allOrderTypes = el;
      (this.router.url.indexOf('create-inbound-schedule') <= -1 && this.router.url.indexOf('copy-inbound-schedule') <= -1) ? this.allOrderTypes.unshift({ orderTypeId:'101,103',orderTypeCode: null, description: "All" }) : '';
      Object.keys(this.orderTypeFilter).length ? this.getFilteredOrderType(el) : this.orderTypeOptions = el;
    }) : '';

    (this.orderTypeAssoction.length == 0) ? this.fetchOrderTypeAssociation() : '';
    (this.orderTypeStatus.length === 0 || forceLoad) ? this.fetchOrderStatus().subscribe(el => {
      this.loaderService.hide();
      this.allOrderStatus = el;
      Object.keys(this.orderStatusFilter).length ? this.getFilteredStatus(el) : this.orderTypeStatus = el;
    }) : '';

    //this.fetchTransferTypes().subscribe(el => this._transferTypeOptions = el)
    (this.changeReasons.length === 0 || forceLoad) ? this.fetchChangeReasons().subscribe(el => {
      this.loaderService.hide();
      this.changeReasons = el;
      Object.keys(this.changeReasonFilter).length ? this.getFilteredChangeReasonType(el) : this.changeReasons = el;
    }) : '';
    (this.transferTypeOptions.length === 0) ? this.fetchTransferTypes() : '';
    (this.datesTypes.length === 0) ? this.fetchDatesTypes() : '';
    (this.divisionTypes.length == 0) ? this.fetchDivisionTypes() : '';
    (this.customerTypes.length == 0) ? this.fetchCustomerTypes() : '';
    (this.orderAllocationTypes.length == 0) ? this.fetchAllocationTypes() : '';
    (this.physicalWarehouse.length == 0) ? this.fetchphysicalWarehouse() : '';
    (this.processDayTypes.length == 0) ? this.fetchProcessDays() : '';

    (this.customerTypes.length === 0 || forceLoad) ? this.fetchCustomerTypes().subscribe(el => {
      this.loaderService.hide();
      this.customerTypes = el;
    }) : '';
  }

  public getFilteredStatus = (statusObj: any) => {
    this.orderTypeStatus = Object.assign([], statusObj).filter(
      item => {
        return this.orderStatusFilter.indexOf(item.orderStatusId) > -1
      }
    )
  }

  public getInstant = () => {

  }

  public getFilteredOrderType = (typeObj: any) => {
    this.orderTypeOptions = Object.assign([], typeObj).filter(
      item => {
        return this.orderTypeFilter.indexOf(item.orderTypeId) > -1
      }
    )
  }

  public getFilteredChangeReasonType = (typeObj: any) => {
    this.changeReasons = Object.assign([], typeObj).filter(
      item => {
        return this.changeReasonFilter.indexOf(item.contextType) > -1
      }
    )
  }
  /**
   * createSingleOrder
   */
  public createSingleOrder = (params: any) => {
    return this._http.post(this.createSingleOrderUrl, params);
  }
  /**
  * viewOrderDetails
  */
  public viewOrderDetails = (id: string) => {
    return this._http.post(this.viewOrderDetailsUrl, { orderId: id });
  }
  /**
   * fetchOrder
   */
  public fetchOrder = (params: any, page?: any, size?: any, sortBy?: any, infiniteScroll? : boolean) => {
    let url: string = `${this.fetchOrderUrl}?page=${page}&size=${size}&sort=${sortBy}`;
    let headerObj = infiniteScroll ? {headers: this.headers} : {};
    return this._http.post(url, params, headerObj);
  }
  /**
   * downloadOrderReport
   */
  public downloadOrderReport = (params: any, page?: any, size?: any, sortBy?: any) => {
    let url: string = `${this.downloadOrderReportUrl}?page=${page}&size=${size}&sort=${sortBy}`;
    return this._http.post(url, params, { responseType: 'text', observe: 'response' });
  }
  /**
   * fetchOrderById 
   */
  public fetchOrderById = (id: any) => {
    let url: string = `${this.fetchOrderByIdUrl}/${id}?source=UI`;
    return this._http.get(url);
  }
  /**
   * fetchChangeLogOrderById 
   */
  public fetchChangeLogOrderById = (id: any) => {
    let url: string = `${this.fetchChangeLogOrderByIdUrl}/${id}`;
    return this._http.get(url);
  }
  /**
   * updateOrders
   */
  public updateOrders = (params: any) => {
    return this._http.post(this.updateOrdersUrl, params);
  }
  public patchBulkOrder = (params: any) => {
    return this._http.patch(this.patchOrderUpdateUrl, params);
  }
  public manageSingleUpdate = (params: any) => {
    return this._http.patch(this.manageSingleUpdateUrl, params);
  }
  public fetchIdFromStatus = (val: any, returnKey: any) => {
    let status: any = this.allOrderStatus;
    let displayLabel: string = '';
    status.forEach(el => {
      displayLabel = (el.description.toLowerCase() === val.toLowerCase() || el.orderStatusId == val) ? el[returnKey] : displayLabel;
    });
    return displayLabel;
  }

  public fetchIdFromOrderType = (val: any, returnKey: any) => {
    let options: any = this.allOrderTypes;
    let displayLabel: string = '';
    options.forEach(el => {
      displayLabel = val ? (el.description.toLowerCase() === val.toLowerCase() || el.orderTypeId == val) ? el[returnKey] : displayLabel : displayLabel;
    });
    return displayLabel != '' ? displayLabel.toLowerCase() : displayLabel;
  }

  public fetchOrderTypeAutoHold = (val: any, returnKey: any) => {
    let options: any = this.allOrderTypes;
    let displayLabel: string = '';
    options.forEach(el => {
      displayLabel = val ? (el.description === val || el.orderTypeId == val) ? el[returnKey] : displayLabel : displayLabel;
    });
    return displayLabel != '' ? displayLabel : displayLabel;
  }

  public fetchCustomerTypeAutoHold = (val: any, returnKey: any) => {
    let options: any = this.customerTypes;
    let displayLabel: string = '';
    options.forEach(el => {
      displayLabel = val ? (el.description === val || el.customerTypeId == val) ? el[returnKey] : displayLabel : displayLabel;
    });
    return displayLabel != '' ? displayLabel : displayLabel;
  }

  public fetchStatusFromId = (val: any, returnKey: any) => {
    let status: any = this.allOrderStatus;
    let displayLabel: string = '';
    status.forEach(el => {
      displayLabel = (el.orderStatusId == val) ? el[returnKey] : displayLabel;
    });
    return displayLabel;
  }

  public fetchChangeReasonById = (val: any, returnKey: any) => {
    let changeReason: any = this.changeReasons;
    let displayLabel: string = '';
    changeReason.forEach(el => {
      displayLabel = (el.description.toLowerCase() === val.toLowerCase() || el.changeReasonId == val) ? el[returnKey] : displayLabel;
    });
    return displayLabel;
  }
  public fetchChangeReasonAutoHold = (val: any, returnKey: any) => {
    let changeReason: any = this.changeReasons;
    let displayLabel: string = '';
    changeReason.forEach(el => {
      displayLabel = (el.description === val || el.changeReasonId == val) ? el[returnKey] : displayLabel;
    });
    return displayLabel;
  }

  public fetchBoh = (supplier: any, product: any) => {
    let url: string = `${this.bohMasterUrl}/suppliers/${supplier}/products/${product}`;
    return this._http.get(url);

  }
  /**
   * getSupplierDetails
   */
  public getSupplierDetails = (id: string) => {
    return this._http.get(this.getSupplierDetailsUrl + '/' + id);
  }

  /**
   * getCustomerDetails
   */
  public getCustomerDetails = (id: string) => {
    return this._http.get(this.getCustomerDetailsUrl + '/' + id, { headers: this.headers });
  }

  /**
   * getCustomerGroupDetails
   */
  public getCustomerGroupDetails = (id: string) => {
    return this._http.get(this.getCustomerGroupDetailsUrl + '/' + id);
  }

  /**
   * getCustomerGroupDetails
   */
  public getCustomerReleaseGroupDetails = (label: string) => {
    return this._http.get(this.getCustomerReleaseGroupUrl + '/' + label);
  }

  /**
   * getProcuctDetails
   */
  public getProcuctDetails = (id: string) => {
    return this._http.get(this.getProductUrl + '/' + id, { headers: this.headers });
  }
  public getProductSupplier = (prd: string, supplier: string) => {
    let url: string = `/${prd}/suppliers/${supplier}`;
    return this._http.get(`${this.getProductSupplierUrl}${url}`);
  }
  public getProductSupplierDimensions = (prd: string, supplier: string) => {
    let url: string = `/${prd}/suppliers/${supplier}/dimensions`;
    return this._http.get(`${this.getProductSupplierUrl}${url}`);
  }
  public getProductCustomer = (prd: string, customer: string) => {
    let url: string = `/${prd}/customers/${customer}`;
    return this._http.get(`${this.getProductCustomerUrl}${url}`);
  }
  /**
   * supplierDetails
   */
  public supplierDetails = (value: any, form: any, callback: Function, fieldName?: string, error?: Function) => {
    let val: string = value;
    this.getSupplierDetails(val).subscribe((data: any) => {
      (data.page.totalElements == 0) ? (fieldName) ? form.get(fieldName).setErrors({ validation: true }) : '' : fieldName ? form.get(fieldName).setErrors(null) : '';
      callback(data);
    },
      (err) => {
        fieldName ? form.get(fieldName).setErrors({ validation: true }) : '';
        error ? error(err) : '';
      })
  }

  /**
  * customerDetails
  */
  public customerDetails = (value: any, form: any, callback: Function, fieldName?: string, error?: Function) => {
    let val: string = value;
    this.getCustomerDetails(val).subscribe((data: any) => {
      (data.page.totalElements == 0) ? (fieldName) ? form.get(fieldName).setErrors({ validation: true }) : '' : fieldName ? form.get(fieldName).setErrors(null) : '';
      callback(data);
    },
      (err) => {
        fieldName ? form.get(fieldName).setErrors({ validation: true }) : '';
        error ? error(err) : '';
      })
  }

  /**
  * customerGroupDetails
  */
  public customerGroupDetails = (value: any, form: any, callback: Function, fieldName?: string, error?: Function) => {
    let val: string = value;
    this.getCustomerGroupDetails(val).subscribe((data: any) => {
      (data.page.totalElements == 0) ? (fieldName) ? form.get(fieldName).setErrors({ validation: true }) : '' : fieldName ? form.get(fieldName).setErrors(null) : '';
      callback(data);
    },
      (err) => {
        fieldName ? form.get(fieldName).setErrors({ validation: true }) : '';
        error ? error(err) : '';
      })
  }

  /**
  * customerGroupDetails
  */
  public productDetails = (value: any, form: any, callback: Function, fieldName?: string, error?: Function) => {
    let val: string = value;
    this.getProcuctDetails(val).subscribe((data: any) => {
      (data.page.totalElements == 0) ? (fieldName) ? form.get(fieldName).setErrors({ validation: true }) : '' : fieldName ? form.get(fieldName).setErrors(null) : '';
      callback(data);
    },
      (err) => {
        fieldName ? form.get(fieldName).setErrors({ validation: true }) : '';
        error ? error(err) : '';
      })
  }
  /**
  * customerGroupDetails
  */
  public productSupplierDetails = (product: any, supplier: any, form: any, callback: Function, fieldName?: string, error?: Function) => {
    this.getProductSupplierDimensions(product, supplier).subscribe((data: any) => {
      (data.page.totalElements == 0) ? (fieldName) ? form.get(fieldName).setErrors({ validation: true }) : '' : (fieldName) ? form.get(fieldName).setErrors(null) : '';
      callback(data);
    },
      (err) => {
        fieldName ? form.get(fieldName).setErrors({ validation: true }) : '';
        error ? error(err) : '';
      })
  }
  /**
   * customer Product Details
   */
  public customerProductDetails = (product: any, customer: any, form: any, callback: Function, fieldName?: string, error?: Function) => {
    this.getProductCustomer(product, customer).subscribe((data: any) => {
      (data.page.totalElements == 0) ? (fieldName) ? form.get(fieldName).setErrors({ validation: true }) : '' : (fieldName) ? form.get(fieldName).setErrors(null) : '';
      callback(data);
    },
      (err) => {
        fieldName ? form.get(fieldName).setErrors({ validation: true }) : '';
        error ? error(err) : '';
      })
  }

  public customerReleaseGroupDetails = (value: any, callback: Function, error?: Function) => {
    let val: string = value;
    this.getCustomerReleaseGroupDetails(val).subscribe((data: any) => {
      callback(data);
    },
      (err) => {
        error ? error(err) : '';
      })
  }

  export() {
    return this._http.get(this.download_endpoint,
      { responseType: 'blob' });
  }

  /**
   * fetchErrorLogById 
   */
  public fetchErrorLogById = (id: any, page: number, limit: number, sortBy: string) => {
    let url: string = `${this.fetchErrorLogDetails}/${id}?page=${page}&size=${limit}&sort=${sortBy}`;
    return this._http.get(url);
  }

  public fetchAllSupplierDepartmentDetails = () => { 
    return this._http.get(this.fetchSupplierDepartment);
  }
   /**
   * fetchTotalQuantityDropdown 
   */
  public fetchTotalQuantityDropdownFromConfig = () => {
    let totalQuantityDropdownConfig = [];
    let conditions = this.appConfiguration.appSettings.manageOrders.totalQuantityConditions;
   conditions.forEach((val:any) => {
      totalQuantityDropdownConfig.push({ label: val, value: val});
    })
    this.totalQuantityDropdown = totalQuantityDropdownConfig;
  }
}