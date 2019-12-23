import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { StaticText } from "@app/shared/constants";
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from "@app/core/services";
import * as moment from 'moment';
import { OrdersService, RouterService, MessagesService } from '@app/shared/services';
import { GridConfiguration, GridColoumnConfig, CellEditConfiguration, GridActionsConfig, FormFieldConfig } from "@app/shared/model";
import { OrdersConfig } from "@app/shared/config";
import { DialogService } from "@app/shared/components";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})

export class EditOrderComponent implements OnInit, OnDestroy {
  displayGridErrorMessage: boolean;
  public editOrder = this.translate.instant('editOrder');
  public searchParam: any = {};
  public addLineDisabled: boolean = true;
  public detailsFooterVisible: boolean = false;
  public detailsHeader: string = this.translate.instant('details');
  public editOrderHeader: string = this.translate.instant('editHeader');
  public okButtonText: string = this.translate.instant('editSubmitText');
  public cancelButtontext: string = this.translate.instant('editCancelText');
  public editOrderFooterVisible: boolean = false;
  public orderDetailsData: any[];
  public id: string;
  public gridConfig: any;
  public data: any = [];
  public coloumnConfig: any;
  public detailsToBeDisplayed: any = [];
  public editHeaderInfoToBeDisplayed: any = [];
  public formFields: any = [];
  public addLineText: string = this.translate.instant('addLine');
  public previousIconClass: string = 'fa fa-plus';
  public previousBtnClass: string = 'btn btn-primary';
  public editForm: any;
  public sortBy: string = 'productId,DESC';
  public orderToggleSort: boolean = false;
  public updatedItems: any = [];
  public toSubmitFlag: boolean = true;
  public orderUpdatedSuccessfully = this.translate.instant('orderUpdatedSuccessfully');

  constructor(private translate: TranslateService, private orderService: OrdersService,
    private route: ActivatedRoute, private routerService: RouterService,
    private loaderService: LoaderService, private dialogService: DialogService,
    private msgService: MessagesService, private cdRef: ChangeDetectorRef, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.id = this.route.snapshot.params.id;
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.orderService.changeReasonFilter = OrdersConfig.orderEditContextType;
    this.orderService.fetchStaticValues(true);
    this.fetchViewOrderDetails(this.id);
    this.initializeGrid();
  }

  public ngDoCheck() {
    this.cdRef.detectChanges();
  }

  public fetchEditForm = (e) => {
    this.editForm = e;
    this.editForm.controls.status.patchValue(this.orderService.fetchIdFromStatus(this.orderDetailsData['status'], 'orderStatusId'));
  }
  /**
   * initializeForm
   */
  public initializeForm = () => {
    this.formFields = [
      new FormFieldConfig({
        type: 'dropdown', defaultDisplayLabel: 'description', name: 'status', defaultOptionsValue: 'orderStatusId', formName: 'status',
        defaultDropDownVal: this.translate.instant('orderStatusLabel'), options: () => { return this.orderService.orderTypeStatus },
        fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12",
        value: this.orderService.fetchIdFromStatus(this.orderDetailsData['status'], 'orderStatusId'),
        change: (e: any, item: any) => {
          e != '' ? this.searchParam['orderStatusId'] = e : delete this.searchParam['orderStatusId'];
          this.onDropdownValueChange(e, item);
        }
      }),
      new FormFieldConfig({
        type: 'dropdown', defaultDisplayLabel: 'description', name: 'changeReasonId', defaultOptionsValue: 'changeReasonId', formName: 'changeReasonId',
        defaultDropDownVal: this.translate.instant('selectChangeReason'),
        defaultValue: '', options: () => { return this.orderService.changeReasons }, fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm",
        fieldWidth: "col-md-12", change: (e: any, item: any) => {
          e != '' ? this.searchParam['changeReasonId'] = e : delete this.searchParam['changeReasonId'];
          this.onDropdownValueChange(e, item);
        }, errorMessages: true, isErrorMessageVisible: (item: any) => {
          let errorObj = this.checkOrderLevelChange() && (this.searchParam['changeReasonId'] == '' || this.searchParam['changeReasonId'] == null) ? { required: true } : null;
          this.editForm.controls.changeReasonId.setErrors(errorObj);
          return this.checkOrderLevelChange() && (this.searchParam['changeReasonId'] == '' || this.searchParam['changeReasonId'] == null);
        }, displayErrorMessage: (item: any) => {
          return this.checkOrderLevelChange() && (this.searchParam['changeReasonId'] == '' || this.searchParam['changeReasonId'] == null) ? this.displayFormErrorMsg(item) : '';
        }
      }),
      new FormFieldConfig({
        type: 'button', formName: '', fieldWidthCls: 'ml-auto', fieldWidth: "ml-3", btnCls: "btn btn-success", btnText: this.translate.instant('updateBtnText'), btnClick: (e) => {
          this.isValidToSubmit() ? this.submitForm() : '';
        }, disabled: (e) => {
          return !this.checkOrderLevelChange() && !this.checkOrderLineLevelChange() || !this.toSubmitFlag;
        }
      }),
      new FormFieldConfig({
        type: 'button', formName: '', fieldWidthCls: '', fieldWidth: "mr-3", btnCls: "btn btn-default mr-3", btnText: "Cancel", btnClick: (e) => {
          this.navigateToManageOrders();
        }, disabled: (e) => {
          //return this.customErrorVisible(e);
        }
      })
    ]
  }

  public isValidToSubmit = () => {
    return (this.orderDetailsData['processingDate'] || this.searchParam['processingDate']) && (this.searchParam['deliveryDate'] || this.orderDetailsData['deliveryDate']) ? true : false
  }

  public checkOrderLevelChange = () => {
    // this.toSubmitFlag = false;
    return this.searchParam['orderStatusId'] || this.searchParam['processingDate'] || this.searchParam['deliveryDate'];
  }

  public checkOrderLineLevelChange = () => {
    return Object.keys(this.updatedItems).length ? true : false;
  }

  /**
   * onDropdownValueChange
   */
  public onDropdownValueChange = (e: any, cfg: any) => {
    this.markAsFiledTouched(cfg);
  }

  public orderLevelChangeValidationCheck = () => {
    return this.checkOrderLevelChange() ? this.searchParam['changeReasonId'] && (this.searchParam['changeReasonId'] != '' || this.searchParam['changeReasonId'] != '') : true;
  }

  public orderLineLevelChangeValidationCheck = () => {
    return this.gridValidation();
  }

  /**
    * markAsFiledTouched
    */
  public markAsFiledTouched = (cfg: any) => {
    this.editForm.get(cfg.formName).markAsTouched();
  }

  /**
    * basicFieldValidation
    */
  public basicFieldValidation = (item: any): boolean => {
    return this.editForm && !this.editForm.get(item.formName).valid && this.editForm.get(item.formName).touched;
  }

  /**
  * displayFormErrorMsg
  */
  public displayFormErrorMsg = (cfg: any) => {
    let key = cfg.formName;
    let errorType = this.editForm && this.editForm.get(cfg.formName).errors ? Array.isArray(this.editForm.get(cfg.formName).errors) ? Object.keys(this.editForm.get(cfg.formName).errors)[0] : Object.keys(this.editForm.get(cfg.formName).errors)[0] : '';
    return this.msgService.fetchMessage(key, errorType);
  }

  public navigateToManageOrders = () => {
    this.routerService.navigateURlQueryParams(['/manage-order'], {
      relativeTo: this.route,
      queryParams: (this.routerService.queryParams && Object.keys(this.routerService.queryParams.params).length) > 0 ? this.routerService.queryParams.params : '',
      skipLocationChange: false
    });
  }

  public isDisabled = () => {
    return !(this.orderLevelChangeValidationCheck() && this.orderLineLevelChangeValidationCheck());
  }

  public submitForm = () => {
    this.isDisabled() ? this.markFormGroupTouched(this.editForm) : this.submitBatch();
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The group to caress..hah
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  public submitBatch = () => {
    let items: any = [];
    this.updatedItems.forEach((el, i) => {
      items.push({
        action: el.quantity > 0 ? 'Updated' : 'Cancelled',
        itemChangeReasonId: el.itemChangeReason ? this.orderService.fetchChangeReasonById(el.itemChangeReason, 'changeReasonId') : '',
        lineNbr: el.lineNumber,
        quantity: el.quantity
      })
    });
    let submitData = this.prepareSubmitData(items);
    this.orderService.manageSingleUpdate(submitData).subscribe((data: any) => {
      this.loaderService.hide();
      (data.hasOwnProperty('status')) ? (data.status && data.status == 'FAILURE') ? this.showFailure(data.message) : (data.status == 'SUCCESS') ? this.showSuccess() : (data.status == 'BAD_REQUEST') ? this.toastr.error('Service error occurred!', '', 2000) : '' : '';
    });
  }

  /*
 * toaster message for update orders
 * */
  public showSuccess = () => {
    this.toastr.success(this.orderUpdatedSuccessfully)
      .then((toast: any) => {
        setTimeout(() => {
          this.toastr.dismissToast(toast);
          this.navigateToManageOrders();
        }, 2000);
      });
  }

  public showFailure = (msg: any) => {
    this.toastr.error(msg)
      .then((toast: any) => {
        setTimeout(() => {
          this.toastr.dismissToast(toast);
          this.navigateToManageOrders();
        }, 2000);
      });
  }

  /**
   * checkGridValues
   */
  public gridValidation = () => {
    let result = true;
    this.data.forEach(el => {
      result = el.rowAction.toLowerCase() !== 'error' && result;
    });
    return result;
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
   * 
   * Need to put this function at one place
   * TODO 
   */
  public createObjectWithBlankValues = (ary: any[]): any => {
    let result: any = {};
    ary.forEach(element => {
      let key: string = element.config.name;
      result[key] = '';
    });
    result['action'] = 'new';
    return result;
  }
  /**
   * addLine
   */
  public addRow = () => {
    this.displayGridErrorMessage = false;
    (this.data.length == OrdersConfig.maxAdditionOfItemsInSingleOrder) ? this.displayGridErrorMessage = true : this.pushBlankObjectInGrid();
  }
  /**
   * pushBlankObjectInGrid
   */
  public pushBlankObjectInGrid = () => {
    this.data.push(this.createObjectWithBlankValues(this.coloumnConfig));
  }
  /**
   * populateColoumnConfig
   */
  public populateColoumnConfig = () => {
    this.coloumnConfig = [
      new GridColoumnConfig({
        name: '', width: 50, title: 'No', render: (rec: any, cfg: any, i: number) => {
          return i + 1;
        }
      }),
      new GridColoumnConfig({
        name: 'itemNumber', width: 130, title: this.translate.instant('itemNumber'),
        enableSorting: true, sortIndex: 'itemNumber', editable: (item: any) => {
          return false;
        }, cellEdit: new CellEditConfiguration({
          type: 'input', blur: (e: any, item: any, cfg: any, index: number) => {
            e.target && e.target.getAttribute('dirty') ? e.target.setAttribute('dirty', "true") : '';
            e.target.value == "" ? this.fillGridObjectValues(index, {}) : this.isDuplicateRec(index) ? this.fillGridObjectValues(index, {}) :
              this.fetchItemsInfo(e.target.value, index, e);
            this.data[index]['itemNumber'] = e.target.value.trim();
          }, displayCellEdit: true, disabled: () => { return false; }, printErrorMsg: (cfg, i, errEl) => {
            return this.itemNumberErrorMessage(cfg, i, errEl);
          }, showErrorMsg: (cfg, i, errEl) => {
            //this.data[i].rowAction = this.validateRowAction(cfg, i);
            return this.showItemNumberErrorMsg(i, (errEl && errEl.getAttribute('dirty') == 'true'));
          }, dirty: false
        }), requiredIcon: true
      }),
      new GridColoumnConfig({ name: 'bic', width: 120, title: this.translate.instant('bic') }),
      new GridColoumnConfig({ name: 'pack', width: 50, title: this.translate.instant('pack') }),
      new GridColoumnConfig({ name: 'size', width: 50, title: this.translate.instant('size') }),
      new GridColoumnConfig({ name: 'description', width: 300, title: this.translate.instant('description') }),
      new GridColoumnConfig({ name: 'tixhi', width: 50, title: this.translate.instant('tixhi') }),
      new GridColoumnConfig({ name: 'boh', width: 100, title: this.translate.instant('boh') }),
      new GridColoumnConfig({
        name: 'quantity', width: 100, title: this.translate.instant('quantity'),
        editable: (item: any) => { return item.rowAction.toLowerCase() !== "cancelled" && (item.rowAction && item.rowAction.toLowerCase() === "edit" || item.rowAction.toLowerCase() === "error") }, cellEdit: new CellEditConfiguration({
          type: 'input', blur: (e: any, item: any, cfg: any, index: number) => {
            e.target && e.target.getAttribute('dirty') ? e.target.setAttribute('dirty', "true") : '';
            this.data[index][cfg.name] = e.target.value;
            this.validateRowAction(cfg, index);
          },
          // keyPress: (e) => { return e.charCode >= 48 },
          printErrorMsg: (cfg, i, errEl) => {
            return this.msgService.fetchMessage('quantity', 'required');
          }, showErrorMsg: (cfg, i, errEl) => {
            return this.data[i][cfg.name] == '' && errEl && errEl.getAttribute('dirty') == "true";
          }, dirty: false, subType: 'number', min: 0, displayCellEdit: true, disabled: (item: any, cfg: any, index: any) => { return this.data[index]['itemNumber'] == ''; }
        }), requiredIcon: true
      }),
      new GridColoumnConfig({
        name: 'itemChangeReason', width: 130, render: (item: any, dataIndex: any) => {
          return item[dataIndex] && item[dataIndex] != null ? this.orderService.fetchChangeReasonById(item[dataIndex], 'description') : '--';
        }, title: this.translate.instant('changeReason'),
        editable: (item: any) => { return (item.rowAction.toLowerCase() !== "cancelled" && (item.rowAction && item.rowAction.toLowerCase() == 'edit' || item.rowAction.toLowerCase() === 'error')); }, cellEdit: new CellEditConfiguration({
          type: 'dropdown', inputClass: 'form-control form-control-sm', change: (e, item, index) => {
            this.data[index]['itemChangeReason'] = e;
            this.validateRowAction(item, index);
          }, name: 'changeReasonId', defaultOptionsValue: 'changeReasonId',
          defaultDisplayLabel: 'description', defaultValue: '*' + this.translate.instant('selectChangeReason'),
          options: () => { return this.orderService.changeReasons },
          printErrorMsg: (cfg, i, errEl) => {
            return this.msgService.fetchMessage('itemChangeReason', 'required');
          }, showErrorMsg: (cfg, i, errEl) => {
            return this.updatedItems[this.data[i]['lineNumber']] && this.data[i]['quantity'] != this.updatedItems[this.data[i]['lineNumber']]['quantity'] ? this.data[i][cfg.name] === '' || this.data[i][cfg.name] === null : false;
          },
        }), requiredIcon: true
      }),
      new GridColoumnConfig({
        name: 'actions',
        width: 50,
        title: 'Action',
        actionItems: [
          new GridActionsConfig({
            btnCls: 'btn btn-outline-primary btn-sm',
            label: '',
            iconClass: 'fa fa-edit', iconTooltip: this.translate.instant('edit'),
            iconClassMethod: (cfg: any, i: number) => {
              return 'fa fa-edit';
            }, iconsTooltipMethod: (cfg: any, i: number) => {
              return this.translate.instant('edit');
            }, click: (item: any, cfg: any, index: any) => {
              item.rowAction = 'Edit';
              this.updatedItems[item.lineNumber] = JSON.parse(JSON.stringify(item));
              this.checkIfQuantitySaved(this.updatedItems[item.lineNumber]);
              this.validateRowAction(cfg, index);
            }, hideBtn: (cfg, i) => {
              return this.data[i].rowAction.toLowerCase() === 'cancelled' || this.data[i].rowAction.toLowerCase() === 'new' || this.data[i].rowAction.toLowerCase() === 'edit' || this.data[i].rowAction.toLowerCase() === 'error';
            }
          }),
          new GridActionsConfig({
            btnCls: 'btn btn-outline-primary btn-sm',
            label: '',
            iconClass: 'fa fa-save', iconTooltip: this.translate.instant('save'),
            iconClassMethod: (cfg: any, i: number) => {
              return 'fa fa-save';
            }, iconsTooltipMethod: (cfg: any, i: number) => {
              return this.translate.instant('save');
            }, click: (item: any, cfg: any) => {
              item.rowAction = item.itemStatus;
              this.updatedItems[item.lineNumber] = item;
              this.checkIfQuantitySaved(this.updatedItems[item.lineNumber]);
            }, disable: (cfg: any, item: any, index: number) => {
              return item.rowAction.toLowerCase() === 'error';
            }, hideBtn: (cfg, i) => {
              return !(this.data[i].rowAction.toLowerCase() === 'edit' || this.data[i].rowAction.toLowerCase() === 'error');
            }
          }),
          new GridActionsConfig({
            btnCls: 'btn btn-outline-primary btn-sm',
            label: '',
            iconClass: 'fa fa-remove', iconTooltip: this.translate.instant('cancel'),
            iconsTooltipMethod: (cfg: any, i: number) => {
              return this.translate.instant('cancel');
            }, click: (item: any, cfg: any, index: any) => {
              this.updatedItems[item.lineNumber].rowAction = item.itemStatus;
              this.data[index] = this.updatedItems[item.lineNumber];
              this.checkIfQuantitySaved(this.updatedItems[item.lineNumber]);
            }, hideBtn: (cfg, i) => {
              return !(this.data[i].rowAction.toLowerCase() === 'edit' || this.data[i].rowAction.toLowerCase() === 'error');
            }
          })
        ]
      })
    ];
  }


  public checkIfQuantitySaved = (data: any) => {
    data['rowAction'] == 'Edit' ? this.toSubmitFlag = false : this.toSubmitFlag = true
  }

  public triggerConfirmation = (item, index) => {
    this.dialogService.showDialog('Warning', "fa fa-exclamation circle-red", "", "", 'Are you sure you want to delete the item?',
      "Ok", () => {
        item.action = item.action.toLowerCase() != "new" ? 'Cancelled' : item.action;
        item.rowAction = "Active";
        item.action.toLowerCase() == "new" ? this.data.splice(index, 1) : '';
      }, "Cancel", () => { });
  }

  public validateRowAction = (cfg: any, i: number) => {
    this.data[i]['rowAction'] = this.data[i]['rowAction'].toLowerCase() === 'edit' || this.data[i]['rowAction'].toLowerCase() === 'error' ?
      this.updatedItems[this.data[i]['lineNumber']] && this.data[i]['quantity'] != this.updatedItems[this.data[i]['lineNumber']]['quantity'] ?
        this.data[i]['itemChangeReason'] == '' || this.data[i]['itemChangeReason'] == null || this.data[i]['quantity'] < 0 ? 'Error' : 'Edit' : 'Edit' : this.data[i]['itemStatus'];
  }

  public findIndex = (item) => {
    let index: any = '';
    this.data.forEach((el, i) => {
      index = el.itemNumber === item.itemNumber ? i : index
    });
    return index
  }
  // view order details
  public fetchViewOrderDetails = (id: string) => {
    this.loaderService.show();
    this.orderService.fetchOrderById(id).subscribe((data: any) => {
      this.orderDetailsData = data.status && data.status == 'FAILURE' ? [] : [data][0];
      
      this.orderDetailsData['supplier'] = this.orderDetailsData['supplier'] && this.orderDetailsData['supplierId'] ? 
      this.orderDetailsData['supplierId'] +'-'+ this.orderDetailsData['supplier'] : this.orderDetailsData['supplier'];
      
      this.orderDetailsData['customerId'] = this.orderDetailsData['customerId'] && this.orderDetailsData['customer'] ? 
      this.orderDetailsData['customerId'] +'-'+ this.orderDetailsData['customer'] : this.orderDetailsData['customerId']  ;
     
      this.orderDetailsData['status'] ? this.getValidStatus(this.orderDetailsData['status']) : this.orderService.orderStatusFilter = [];
      this.orderService.fetchStaticValues(true);
      this.configInitialization();
      this.data = data['items'] && data['items'].length > 0 ? data['items'] : [];
      this.appendActionToItem('edit');
      //this.prepareSubmitData();
      this.data.length > 0 ? this.fetchBOH() : '';
      this.initializeForm();
      this.loaderService.hide();
    });
  }

  public getValidStatus = (status: any) => {
    let statusId = this.orderService.fetchIdFromStatus(status, 'orderStatusId');
    this.orderService.orderStatusFilter = OrdersConfig.editOrderStatus[statusId];
  }

  public fetchBOH = () => {
    let productID: any = [];
    this.data.forEach((el: any) => {
      productID.push(el.itemNumber);
    });
    this.orderService.fetchBoh(this.orderDetailsData['supplierId'], productID.toString()).subscribe(data => {
      let res: any[] = data && data['status'] && data['status'] == 'SUCCESS' && data['productBOHs'].length ? data['productBOHs'] : [];
      res.forEach(el => {
        this.data.forEach(rec => {
          rec.itemNumber === el.productId ? rec.boh = el.boh : '';
        })
      });
      this.loaderService.hide();
    }, err => {
    }
    );
  }
  /**
   * appendActionToItem
   */
  public appendActionToItem = (status) => {
    this.data.forEach(el => {
      el.action = el.itemStatus ? el.itemStatus : 'Active';
      el.rowAction = el.action;
    });
  }
  /**
   * prepareSubmitData
   */
  public prepareSubmitData = (items: any) => {
    let formData = {};
    formData = {
      'orderStatusId': this.searchParam['orderStatusId'] ? this.searchParam['orderStatusId'] : this.orderService.fetchIdFromStatus(this.orderDetailsData['status'], 'orderStatusId'),
      'processingDate': this.searchParam['processingDate'] ? this.searchParam['processingDate'] : moment(this.orderDetailsData['processingDate']).format('MM/DD/YYYY'),
      'deliveryDate': this.searchParam['deliveryDate'] ? this.searchParam['deliveryDate'] : moment(this.orderDetailsData['deliveryDate']).format('MM/DD/YYYY'),
      'orderId': this.orderDetailsData['orderId'],
      'itemUpdateRequest': items
    }
    // items.length ? formData['itemUpdateRequest'] = items : '';
    this.searchParam['changeReasonId'] ? formData['changeReasonId'] = this.searchParam['changeReasonId'] : '';
    return formData;
  }
  /**
   * populateData
   */
  public populateData = (e: any, key: any) => {
    this.searchParam[key] = moment(e).format('MM/DD/YYYY');
  }
  /**
   * configInitialization
   */
  public configInitialization = () => {
    this.detailsToBeDisplayed = [
      { label: this.translate.instant('orderId'), key: 'orderId', value: '' },
      { label: this.translate.instant('customerId'), key: 'customerId', value: '' },
      { label: this.translate.instant('orderType'), key: 'orderType', value: '' },
      { label: this.translate.instant('supplier'), key: 'supplier', value: '' },
      { label: this.translate.instant('status'), key: 'status', value: '' },
      { label: this.translate.instant('createdBy'), key: 'created', value: '' }];
    this.editHeaderInfoToBeDisplayed = [{
      label: this.translate.instant('processDate'), key: 'processingDate', value: '',
      type: 'datepicker', readonly: true, showDefaultDate: this.orderDetailsData['processingDate'] != null ? true : false,
    }, {
      readonly: true,
      type: 'datepicker', label: this.translate.instant('deliveryDate'), key: 'deliveryDate',
      showDefaultDate: this.orderDetailsData['deliveryDate'] != null ? true : false, value: '',
    },
    { label: this.translate.instant('cutOffTime'), key: '', value: '', type: 'input', subType: 'text', inputClass: 'form-control form-control-sm', disabled: true }];
  }
  /**
   * navigate
   */
  public navigate = () => {
    this.routerService.navigateTo('/manage-order');
  }
  public navigateUrlWithQeury = () => {

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

  public formatLogisticOrderData = (cfg: any) => {
    let result: string;
    result = this.orderDetailsData[cfg.key];
    return result;
  }


  /**
   * fetchDatepickerMinDate
   */
  public fetchDatepickerMinDate = (key: any) => {
    let processingDate = this.searchParam['processingDate'] && this.searchParam['processingDate'] != null ? this.searchParam['processingDate'] : this.orderDetailsData['processingDate'];
    return key == 'processingDate' ? moment(new Date()).toDate() : processingDate && new Date(processingDate) > new Date() ? moment(processingDate).toDate() : new Date();
  }

  /**
  * fetchDatepickerMaxDate
  */
  public fetchDatepickerMaxDate = (key: any) => {
    let deliveryDate = this.searchParam['deliveryDate'] && this.searchParam['deliveryDate'] != null ? this.searchParam['deliveryDate'] : this.orderDetailsData['deliveryDate'];
    return key == 'processingDate' ? deliveryDate && new Date(deliveryDate) > new Date() ? moment(deliveryDate).toDate() : new Date() : null;
  }

  public updateDate = (e: any, key: any) => {
    (moment(e).format('YYYY-MM-DD') != this.orderDetailsData[key]) ? this.searchParam[key] = moment(e).format('MM/DD/YYYY') : delete this.searchParam[key];
  }


  /**
 * fetchDatepickerValue
 */
  public fetchDatepickerValue = (key: any) => {
    return this.orderDetailsData ? this.searchParam[key] || this.orderDetailsData[key] : '';
  }
  /**
     * itemNumberErrorMessage 
     */
  public itemNumberErrorMessage = (cfg: any, i: number, el: any): string => {
    return !this.data[i][cfg.name] || this.data[i][cfg.name] == '' ? this.msgService.fetchMessage(cfg.name, 'required') : this.isDuplicateRec(i) ? this.msgService.fetchMessage(cfg.name, 'duplicate') : el.getAttribute('error');
  }
  /**
   * isDuplicateRec
   */
  public isDuplicateRec = (i: number): boolean => {
    let result: boolean = false;
    this.data.forEach((element, index) => {
      result = result || (element && element['itemNumber'] && this.data[i]['itemNumber'] && element['itemNumber'] == this.data[i]['itemNumber'].trim() && i != index)
    });
    return result;
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
    this.data[index].action = "new";
  }
  /**
 * fetchItemsInfo
 */
  public fetchItemsInfo = (val: string, index: number, el: any) => {
    this.orderService.getItemDetails(val).subscribe(element => {
      this.loaderService.hide();
      (element['description'] && element['description'].toLowerCase() == "no matching item found") ? this.noItemNumberFound(index, el) : this.fillGridObjectValues(index, element);
      this.data[index]['itemNumber'] = val;
    });
  }
  /**
   * noItemNumberFound
   */
  public noItemNumberFound = (index: number, el: any) => {
    el.target.setAttribute('error', this.msgService.fetchMessage('itemNumber', 'validation'));
    this.fillGridObjectValues(index, {})
  }
  /**
   * showItemNumberErrorMsg
   */
  public showItemNumberErrorMsg = (i: number, dirty: boolean) => {
    let result = false;
    result = !(this.data[i]['pack'] != '') && dirty;
    return result ? result : false;
  }

  /**
   * triggerSorting
   */
  public triggerSorting = (colDef: any) => {
    this.orderToggleSort = !this.orderToggleSort;
    this.orderToggleSort == true ? (this.data.sort(function (a, b) { return (a.itemNumber < b.itemNumber) ? 1 : -1; }))
      : (this.data.sort(function (a, b) { return (a.itemNumber < b.itemNumber) ? -1 : 1; }));
  }

  ngOnDestroy() {
    this.orderService.orderStatusFilter = [];
    this.orderService.changeReasonFilter = [];
  }
}
