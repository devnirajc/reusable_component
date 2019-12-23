import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { PlatformLocation } from '@angular/common'
import { SingleOrderService } from './single-order.service';
import * as moment from 'moment';
import {
  GridColoumnConfig,
  GridConfiguration,
  GridActionsConfig,
  CellEditConfiguration,
  FormFieldConfig
} from '@app/shared/model';
import {
  OrdersService,
  MessagesService,
  RouterService
} from '@app/shared/services';
import { StaticText } from "@app/shared/constants";
import { OrdersConfig } from "@app/shared/config";
import { DialogService } from "@app/shared/components/modal-dialog/modal-dialog.service";
import { LoaderService } from "@app/core/services";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleOrderComponent implements OnInit {
  public gridConfig: any = [];
  public coloumnConfig: any = [];
  public data: any = [];
  public form: any;
  public fromFields: any = [];
  public submitText: string = 'Create';
  public submitBtnClass: string = 'btn btn-success';
  public supplierObj: any[] = [];
  public addLineText: string = 'Add Line';
  public previousIconClass: string = 'fa fa-plus';
  public previousBtnClass: string = 'btn btn-primary';
  public cancelBtnText: string = 'Cancel';
  public cancelBtnClass: string = 'btn btn-default';
  public displayGridErrorMessage: boolean = false;
  public createdOrderNumber: any;
  public reset: boolean = false;
  @ViewChild('orderSuccessfullyCreated')
  private orderSuccessTemplate: TemplateRef<any>;
  public validateError: boolean = true;
  public orderCreatedSuccessfully = this.translate.instant('orderCreatedSuccessfully');

  constructor(private singleOrderService: SingleOrderService,
    private orderService: OrdersService,
    private msgService: MessagesService, private cdRef: ChangeDetectorRef, private loadingService: LoaderService,
    private routerService: RouterService, private dialogService: DialogService, private translate: TranslateService, private location: PlatformLocation, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    location.onPopState(() => {
      this.dialogService.hidePopup();
    });
  }

  ngOnInit() {
    this.initalizeGridData();
  }
  public ngDoCheck() {
    this.cdRef.detectChanges();
  }
  /**
   * initalizeGridData
   */
  public initalizeGridData = () => {
    this.pushBlankObjectInGrid();
  }
  /**
   * pushBlankObjectInGrid
   */
  public pushBlankObjectInGrid = () => {
    this.data.push(this.createObjectWithBlankValues(this.coloumnConfig));
    (this.data.length > 1) ? this.focusOnField('itemNumber', this.data.length - 1) : '';
  }

  public focusOnField = (name: string, index: number) => {
    setTimeout(() => {
      document.getElementsByName(`${name}_${index}`)[0].focus();
    }, 0);
  }
  /**
   * addLine
   */
  public addRow = () => {
    this.displayGridErrorMessage = false;
    (this.data.length == OrdersConfig.maxAdditionOfItemsInSingleOrder) ? this.displayGridErrorMessage = true : this.pushBlankObjectInGrid();
  }
  /**
   * displayMinAndMaxErrorMsg
   */
  public displayMinAndMaxErrorMsg = (): string => {
    return this.data.length === 1 ? this.msgService.fetchMessage('minItemLimitForCreation') : this.data.length == OrdersConfig.maxAdditionOfItemsInSingleOrder ? `${this.msgService.fetchMessage('additionUpto')} ${OrdersConfig.maxAdditionOfItemsInSingleOrder} ${this.msgService.fetchMessage('records')}!` : '';

  }

  public validationCheck = (e: any) => {
    this.validateError = e;
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
    result['itemStatus'] = "ACTIVE";
    return result;
  }
  /**
   * onSubmit
   */
  public onSubmit = (e?: any) => {
    this.isDisabled() ? this.markFormGroupTouched(this.form) : this.submitForm();
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

  public submitForm = () => {
    let requestData: any = {};
    requestData = Object.assign({}, this.form.getRawValue());
    requestData['itemDetails'] = this.data;
    requestData['deliveryDate'] = moment(requestData['deliveryDate']).format('MM/DD/YYYY');
    requestData['processDate'] = moment(requestData['processDate']).format('MM/DD/YYYY');
    requestData['orderType'].toLowerCase() === 'rush' ? delete requestData['transferType'] : '';
    requestData['transferType'] == '' || requestData['transferType'] == StaticText.selectTransferTypeLabel ? delete requestData['transferType'] : '';
    let val = this.orderService.fetchIdFromOrderType(requestData['orderType'], 'description');
    requestData['orderType'] = val.toUpperCase();
    this.reset = false;
    this.orderService.createSingleOrder(requestData).subscribe(data => {
      this.clearCreatedOrderNumber();
      this.loadingService.hide();
      this.createdOrderNumber = data['orderId'];
      this.showSuccess();
    })
  }

  /*s
 * toaster message for update orders
 * */
  public showSuccess = () => {
    this.toastr.success(this.orderCreatedSuccessfully, '', { dismiss: 'click', showCloseButton: false, toastLife: 4000 });
  }

  public isDisabled = (): boolean => {
    return this.form && !this.form.valid || !this.validateTransferType() || !this.checkGridValues();
  }
  /**
   * fetchForm = 
   */
  public fetchForm = (e: any) => {
    this.form = e;
  }
  /**
   * validateTransferType
   */
  public validateTransferType = () => {
    let val = this.form ? this.orderService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') : '';
    return this.form && (val === "rush" || val === 'standing') ? true : (this.form.get('transferType').value != '') && (val === 'transfer');
  }

  public validateSupplierID = () => {
    return this.form && this.form.get('supplierId').value.toLowerCase() == '' || this.form.get('supplierId').value == StaticText.selectSupplier;
  }
  /**
   * checkGridValues
   */
  public checkGridValues = () => {
    let result = true;
    this.data.forEach((element, index) => {
      document.getElementsByName(`itemNumber_${index}`)[0].setAttribute('dirty', 'true');
      document.getElementsByName(`quantity_${index}`)[0].setAttribute('dirty', 'true');
      result = result && (element.itemNumber && element.quantity && element.productDescription && element.itemNumber != '' && element.quantity != '' && element.productDescription != '')
    });
    return result;
  }
  /**
   * deleteAction
   */
  public deleteAction = (index: number) => {
    this.displayGridErrorMessage = false;
    (this.data.length == 1) ? this.displayGridErrorMessage = true : (this.data[index].itemNumber && this.data[index].itemNumber != '') ? this.triggerWarning(index) : this.data.splice(index, 1);
  }

  /**
   * deleteSingleOrder
   */
  public triggerWarning = (index: number) => {
    this.dialogService.showDialog("Warning !", "fa fa-exclamation circle-red", "", "", "Are you sure you want to delete this item?", "Delete", () => {
      this.data.splice(index, 1)
    }, "Cancel", () => { });
  }
  /**
   * navigateTo  
   */
  public navigateTo = (url) => {
    this.routerService.navigateTo(url);
  }
  /**
   * navigateToEditView
   */
  public navigateToViewOrder = () => {
    this.dialogService.hidePopup();
    this.routerService.navigateTo(`/manage-order/view-order/${this.createdOrderNumber}`);
    this.clearCreatedOrderNumber();

  }
  /**
   * clearCreatedOrderNumber 
   */
  public clearCreatedOrderNumber = () => {
    this.data = [];
    this.pushBlankObjectInGrid();
    this.reset = true;
  }
  public onCancel = () => {
    this.routerService.navigateTo('/manage-order');
  }
}
