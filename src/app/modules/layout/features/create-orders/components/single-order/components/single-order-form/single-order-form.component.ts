import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from "@app/shared/model";
import { Validators, FormGroup, AbstractControl } from "@angular/forms";
import { MessagesService, OrdersService } from "@app/shared/services";
import * as moment from 'moment';
import { StaticText } from "@app/shared/constants";
import { OrdersConfig } from "@app/shared/config";
import { LoaderService } from "@app/core/services";
import { TranslateService } from "@ngx-translate/core";
import * as $ from 'jquery';

@Component({
  selector: 'app-single-order-form',
  templateUrl: './single-order-form.component.html',
  styleUrls: ['./single-order-form.component.scss']
})
export class SingleOrderFormComponent implements OnInit {
  supplierObj: any = {};
  @Input() form: FormGroup;
  @Input() reset: boolean;
  @Output() fetchForm = new EventEmitter<any>();
  @Output() validationCheck = new EventEmitter<any>();
  @Output() submitEvent = new EventEmitter<any>();
  private customerCheckTimeOut;
  public formFields: any;

  constructor(private translate: TranslateService, private ordersService: OrdersService, private msgService: MessagesService, private loadingService: LoaderService) { }

  ngOnInit() {
    this.ordersService.fetchStaticValues();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (changes['reset']) {
      changes['reset'].currentValue ? this.initializeForm() : '';
    }
  }

  public fetchSingleOrderForm = (e: any) => {
    this.fetchForm.emit(e);
  }
  /**
   * Configuration of forms have bevalidateError
   */
  public initializeForm = () => {
    this.formFields = [
      new FormFieldConfig({
        type: 'dropdown', defaultDisplayLabel: 'description', defaultOptionsValue: 'orderTypeId', formName: 'orderType',
        label: this.translate.instant('orderType'), defaultValue: '', defaultDropDownVal: StaticText.selectOrderTypeLabel,
        options: () => { return this.fetchCreationTypes() },
        fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label',
        inputClass: "form-control form-control-sm", fieldWidth: "col-md-8", validation: [Validators.required],
        renderLabel: (item) => {
          return this.renderLabel(item, true);
        }, change: (e: any, item: any) => {
          this.disableRefDoc(e);
          this.onOrderTypeChange(e, item);
        }, errorMessages: true, isErrorMessageVisible: (item: any) => {
          return this.basicFieldValidation(item);
        }, displayErrorMessage: (item: any) => {
          return this.displayFormErrorMsg(item);
        }
      }),

      new FormFieldConfig({
        type: 'input', subtype: 'number', label: StaticText.customerId, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', fieldWidth: 'col-md-8', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', inputClass: "form-control form-control-sm", formName: 'customerId',
        validation: [Validators.required, this.validateCustomerDetails.bind(this)], min: 0, renderLabel: (item) => {
          return this.renderLabel(item, true);
        }, errorMessages: true, isErrorMessageVisible: (item: any) => {
          return this.basicFieldValidation(item);
        }, displayErrorMessage: (item: any) => {
          return this.displayFormErrorMsg(item);
        }, keyPress: (e: any, cfg: any) => {
          this.form.get(cfg.formName).markAsTouched();
          e.keyCode === 13 ? this.submitForm() : '';
        }, maxlength: 18,
        showLoader: (item: any) => {
          return true;
        }
      }),

      new FormFieldConfig({ type: 'input', subtype: 'number', maxlength: 10, formName: 'routeId', min: 0, label: StaticText.routeId, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', fieldWidth: 'col-md-8', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', inputClass: "form-control form-control-sm", }),

      new FormFieldConfig({
        type: 'dropdown', defaultDisplayLabel: 'label', defaultOptionsValue: 'value', defaultValue: '', defaultDropDownVal: StaticText.selectTransferTypeLabel, options: () => { return this.ordersService.transferTypeOptions }, formName: 'transferType', disabled: () => { return this.disableTransferType() }, label: StaticText.transferType, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', fieldWidth: "col-md-8", inputClass: "form-control form-control-sm",
        renderLabel: (item: any) => {
          let result: boolean = this.form && (this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer');
          return this.renderLabel(item, result);
        }, change: (e: any, item: any) => {
          this.onOrderTypeChange(e, item);
          (e == '' || e == StaticText.selectTransferTypeLabel) ? this.form.get('transferType').setErrors({ required: true }) : this.form.get('transferType').setErrors(null);
        }, errorMessages: true, isErrorMessageVisible: (item: any) => {
          this.form ? !this.form.get('transferType').value || this.form.get('transferType').value == '' ? this.form.get('transferType').setErrors({ required: true }) : this.form.get('transferType').setErrors(null) : '';
          return this.form && this.form.get('transferType').value == '' && this.form.get('transferType').touched && this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer';
        }, displayErrorMessage: (item: any) => {
          return this.form && (this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer') ? this.displayFormErrorMsg(item) : '';
        }
      }),

      new FormFieldConfig({
        type: 'input', keyPress: (e) => { return this.omit_special_char(e); }, formName: 'poRefNumber', disabled: () => { return true; },
        maxlength: 10,
        blur: (e: any, item: any) => {
          (e.target.value === '' && this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer') ? this.form.get('poRefNumber').setErrors({ required: true }) : this.form.get('poRefNumber').setErrors(null);
        },
        isErrorMessageVisible: (item: any) => {
          this.form && this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer' ? !this.form.get('poRefNumber').value || this.form.get('poRefNumber').value == '' ? this.form.get('poRefNumber').setErrors({ required: true }) : this.form.get('poRefNumber').setErrors(null) : '';
          return this.basicFieldValidation(item) && this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer';
        }, displayErrorMessage: (item: any) => {
          return this.form && (this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer') ? this.displayFormErrorMsg(item) : '';
        },
        errorMessages: true,
        renderLabel: (item: any) => {
          let result: boolean = this.form && (this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') === 'transfer');
          return this.renderLabel(item, result);
        },
        label: StaticText.refDoc, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', fieldWidth: "col-md-8", inputClass: "form-control form-control-sm"
      }),

      new FormFieldConfig({ type: 'input', subtype: 'hidden', formName: 'divisionId', value: 0 }),

      new FormFieldConfig({
        type: 'input', formName: 'routeCode', min: 0, label: StaticText.routeCode, maxlength: 4, renderLabel: (item) => {
          return this.renderLabel(item, false);
        }, errorMessages: true, isErrorMessageVisible: (item: any) => {
          return this.basicFieldValidation(item);
        }, displayErrorMessage: (item: any) => {
          return this.displayFormErrorMsg(item);
        }, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', fieldWidth: 'col-md-8', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', inputClass: "form-control form-control-sm",
      }),

      new FormFieldConfig({
        type: 'datefield', minDate: () => { return new Date() }, maxDate: () => {
          return this.form && this.form.get('deliveryDate').value ? this.form.get('deliveryDate').value : null;
        }, formName: 'processDate', showDefaultDate: true, placeholder: 'mm/dd/yyyy', datepickerCls: 'form-control background-white', defaultValue: moment(new Date()), label: StaticText.processDate, renderLabel: (item) => {
          return this.renderLabel(item, false);
        }, change: (e: any, item: any) => {
        }, readOnly: () => {
          return 'readonly';
        }, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', fieldWidth: 'col-md-8', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', inputClass: "form-control form-control-sm",
      }),

      new FormFieldConfig({
        type: 'datefield', showDefaultDate: true, minDate: () => {
          return this.form && this.form.get('processDate').value ? this.form.get('processDate').value : new Date();
        }, maxDate: () => { }, placeholder: 'mm/dd/yyyy', datepickerCls: 'form-control background-white', formName: 'deliveryDate', defaultValue: moment(new Date()).add(1, 'days'), label: StaticText.deliveryDate, renderLabel: (item) => {
          return this.renderLabel(item, false);
        }, readOnly: () => {
          return 'readonly';
        }, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', fieldWidth: 'col-md-8', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', inputClass: "form-control form-control-sm",
      }),

      new FormFieldConfig({ type: 'input', subtype: 'number', formName: 'stopId', min: 0, maxlength: 5, label: StaticText.stop, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', displayLabelCls: 'form-group required row', fieldWidth: 'col-md-8', fieldLabelClass: 'col-md-4 col-form-label', inputClass: "form-control form-control-sm", }),

      new FormFieldConfig({ type: 'input', keyPress: (e) => { return this.omit_special_char(e); }, formName: 'comment', maxlength: 60, label: StaticText.comments, fieldWidthCls: 'col-lg-4 col-md-6 col-sm-6', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-4 col-form-label', fieldWidth: "col-md-8", inputClass: "form-control form-control-sm" }),
      
      new FormFieldConfig({ type: 'input', subtype: 'hidden', formName: 'uom' }),
    ]
  }
  /**
   * setNotFound
   */
  public notFound = () => {
    this.form.get('customerId').setErrors({ required: true });
  }
  /**
   * validateCustomerDetails
   */
  public validateCustomerDetails = (control: AbstractControl) => {
    let val: string = control.value;
    return val && val != '' ? this.fetchCustomerInfo(control) : null;
  }
  /**
    * fetchSupplierInfo
    */
  public fetchCustomerInfo = (control: any) => {
    let val: string = control.value;
    $('[name="customerId"]').next('.loader').show();
    clearTimeout(this.customerCheckTimeOut);
    return new Promise((resolve, reject) => {
      this.customerCheckTimeOut = setTimeout(() => {
        this.ordersService.customerDetails(val, this.form, (data) => {
          data.page.totalElements > 0 && data['page'] && data['page']['content'] && data['page']['content'][0] && data['page']['content'][0]['divisionId'] ? this.form.get('divisionId').setValue(data['page']['content'][0]['divisionId']) : this.form.get('divisionId').setValue(0);
          data.page.totalElements > 0 && data['page'] && data['page']['content'] && data['page']['content'][0] && data['page']['content'][0]['uom'] ? this.form.get('uom').setValue(data['page']['content'][0]['uom']) : this.form.get('uom').setValue('');
          this.loadingService.hide();
          $('[name="customerId"]').next('.loader').hide();
          data.page.totalElements > 0 ? resolve(null) : resolve({ validation: true });
        }, 'customerId')
      }, 600);
    });
  }
  /**
   * renderMandatoryLabel
   */
  public renderLabel = (cfg, required) => {
    return cfg && cfg.label && required ? `${cfg.label}<sup class="text-danger">*</sup>` : (cfg && cfg.label) ? cfg.label : '';
  }
  /**
   * onOrderTypeChange
   */
  public onOrderTypeChange = (e: any, cfg: any) => {
    this.markAsFiledTouched(cfg);
  }
  /**
   * markAsFiledTouched
   */
  public markAsFiledTouched = (cfg: any) => {
    this.form.get(cfg.formName).markAsTouched();
  }
  /**
   * basicFieldValidation
   */
  public basicFieldValidation = (item: any): boolean => {
    return this.form && !this.form.get(item.formName).valid && this.form.get(item.formName).touched;
  }
  /**
   * displayFormErrorMsg
   */
  public displayFormErrorMsg = (cfg: any) => {
    let key = cfg.formName;
    let errorType = this.form && this.form.get(cfg.formName).errors ? Array.isArray(this.form.get(cfg.formName).errors) ? Object.keys(this.form.get(cfg.formName).errors)[0] : Object.keys(this.form.get(cfg.formName).errors)[0] : '';

    return this.msgService.fetchMessage(key, errorType);
  }
  /**
   * disableTransferType
   */
  public disableTransferType = (): boolean => {
    let val: string = this.form ? this.ordersService.fetchIdFromOrderType(this.form.get('orderType').value, 'description') : '';
    return this.form && (val === 'transfer' || val === 'standing') ? false : true;
  }
  /**
   * disableRefDoc
   */
  public disableRefDoc = (e: any) => {
    (e == '' || e.toLowerCase() == 'rush' && this.form) ? this.form.get('poRefNumber').disable({ onlySelf: true }) : (this.form) ? this.form.get('poRefNumber').enable({ onlySelf: true }) : '';
  }
  /**
   * fetchCreationTypes
   */
  public fetchCreationTypes = () => {
    let result: any = [];
    let createOrderType: any = OrdersConfig.createOrderTypes;
    if (this.ordersService.orderTypeOptions.length > 0) {
      this.ordersService.orderTypeOptions.forEach(element => {
        createOrderType.indexOf(element.description.toLowerCase()) != -1 ? result.push(element) : '';
      });
    }
    return result;
  }

  public omit_special_char = (event) => {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
  }

  public submitForm = () => {
    this.submitEvent.emit(true);
  }
}
