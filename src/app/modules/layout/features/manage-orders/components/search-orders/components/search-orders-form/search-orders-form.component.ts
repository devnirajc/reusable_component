import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from "@app/shared/model";
import { StaticText, Messages } from "@app/shared/constants";
import { MessagesService, OrdersService } from "@app/shared/services";
import * as moment from 'moment';
import { LoaderService } from "@app/core/services";
import { TranslateService } from "@ngx-translate/core";
import { Validators } from "@angular/forms";
import { OrdersConfig } from '@app/shared/config';

@Component({
  selector: 'app-search-orders-form',
  templateUrl: './search-orders-form.component.html',
  styleUrls: ['./search-orders-form.component.scss']
})
export class SearchOrdersFormComponent implements OnInit {
  @Output() formReset = new EventEmitter<any>();
  @Output() searchGridData = new EventEmitter<any>();
  @Input() queryParams: any;
  public formFields: any = [];
  public form: any;
  public searchQueryData: any = {};
  public displayErrMessage: string;
  public displayErr: boolean = false;
  public supplierObj: any = [];
  public supplierDepartment: any = [];
  constructor(private translate: TranslateService, private msgService: MessagesService, private loadingService: LoaderService, private ordersService: OrdersService) { }

  ngOnInit() {
    this.ordersService.orderTypeFilter = OrdersConfig.noStandingOrderTypes;
    this.ordersService.fetchStaticValues(true);
    this.fetchAllSupplierDepartment();
    this.ordersService.fetchTotalQuantityDropdownFromConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (changes['queryParams']) {
      Object.keys(changes['queryParams'].currentValue.params).length > 0 ? this.prePopulateFormFields(changes['queryParams'].currentValue.params) : this.initializeForm();
    }
  }
  /**
   * prePopulateFormFields
   */
  public prePopulateFormFields = (params: any) => {
    this.searchQueryData = Object.assign({}, params);
    this.initializeForm();
  }
  /**
   * validateParams 
   */
  public validateParams = (obj: any) => {
    let params: any = Object.assign({}, obj);
    Object.keys(obj).forEach(el => {
      ['orderId', 'productId', 'customerGroupId'].indexOf(el) > -1 ? !this.validateNumber(params[el]) ? delete params[el] : '' : '';
    });
    return params;
  }
  /**
   * validateNumber
   */
  public validateNumber = (val: any) => {
    const str = val;
    var regEx = new RegExp("^[0-9\s\+]+$");
    return regEx.test(str);
  }


  /** Fetch Supplier department */
  public fetchAllSupplierDepartment = () => {
    let totalDropdownConfig = [];
    this.ordersService.fetchAllSupplierDepartmentDetails().
      subscribe((data: any) => {
        this.loadingService.hide();
        this.supplierDepartment = data.page['content'].length ? data.page['content'] : [];
        this.supplierDepartment.forEach(function (message, index) {
          totalDropdownConfig.push({ value: message['retailSectionCode'], label: message['retailSectionCode']+'-'+message['retailSectionDesc'] });
        });
        this.supplierDepartment = totalDropdownConfig;
      }, err => {
      });
  }


  /**
   * setFieldValue
   */
  public setFieldValue = (fld: any, val: any) => {
    this.searchQueryData[fld.formName] = val;
  }
  public initializeForm = () => {
    this.formFields = [new FormFieldConfig({
      type: 'dropdown', tooltip: (cfg: any) => {
        return this.translate.instant('selectDivision');
      }, value: this.searchQueryData['divisionId'] ? this.searchQueryData['divisionId'] : '', defaultDisplayLabel: 'label', defaultOptionsValue: 'value', formName: 'divisionId', defaultValue: this.translate.instant('selectDivision'), options: () => { return this.ordersService.divisionTypes }, fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12", change: (e: any, item: any) => {
        this.populateSearchQuery(e, item);
      }
    }),
    new FormFieldConfig({
      type: 'input', subtype: 'number', tooltip: (cfg: any) => {
        return this.translate.instant('customerOrderGroup');
      }, readOnly: () => {
        return this.checkIfFieldIsDisable('customerId');
      },
      tabIndex: () => {
        return this.checkIfFieldIsDisable('customerId') == true ? "-1" : "0";
      },
      keyDown: (e: any, cfg: any) => {
        if (e.key === "Enter") {
          this.populateSearchQuery(e.target.value, cfg);
        }
      }, value: this.searchQueryData['customerGroupId'] ? this.searchQueryData['customerGroupId'] : '', formName: 'customerGroupId', placeholder: this.translate.instant('customerGroupId'), fieldWidthCls: 'col-lg-1 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm",
      defaultValue: this.searchQueryData['customerGroupId'] ? this.searchQueryData['customerGroupId'] : '',
      blur: (e: any, item: any) => {
        this.populateSearchQuery(e.target.value, item);
      }, min: 0
    }), new FormFieldConfig({
      type: 'input', subtype: 'number', maxlength: 18,
      readOnly: () => {
        return this.checkIfFieldIsDisable('customerGroupId');
      },
      tabIndex: () => {
        return this.checkIfFieldIsDisable('customerGroupId') == true ? "-1" : "0";
      },
      tooltip: (cfg: any) => {
        return this.translate.instant('customerId');
      },
      keyDown: (e: any, cfg: any) => {
        if (e.key === "Enter") {
          this.populateSearchQuery(e.target.value, cfg);
        }
      }, value: this.searchQueryData['customerId'] ? this.searchQueryData['customerId'] : '', formName: 'customerId', placeholder: this.translate.instant('customerId'), fieldWidthCls: 'col-lg-1 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm orderCustomer",
      defaultValue: this.searchQueryData['customerId'] ? this.searchQueryData['customerId'] : '',
      blur: (e: any, item: any) => {
        this.populateSearchQuery(e.target.value, item);
      }, min: 0
    }), new FormFieldConfig({
      type: 'input', tooltip: (cfg: any) => {
        return this.translate.instant('supplier');
      }, keyDown: (e: any, cfg: any) => {
        if (e.key === "Enter") {
          this.populateSearchQuery(e.target.value, cfg);
          // this.search(e);
        }
      }, validation: [Validators.required],
      errorMessages: true,
      maxlength: 18,
      isErrorMessageVisible: (item: any) => {
        return this.searchQueryData.bic && this.searchQueryData.bic != '' && this.basicFieldValidation(item);
      },
      displayErrorMessage: (item: any) => {
        return this.searchQueryData.bic && this.searchQueryData.bic != '' && this.displayFormErrorMsg(item);
      },
      blur: (e: any, cfg: any) => {
        this.populateSearchQuery(e.target.value, cfg);
      }, hidden: () => {
        return false;
      },
      defaultValue: this.searchQueryData['supplierId'] ? this.searchQueryData['supplierId'] : '',
      value: this.searchQueryData['supplierId'] ? this.searchQueryData['supplierId'] : '',
      min: 0, subtype: 'number', formName: 'supplierId', placeholder: this.translate.instant('supplier'), fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm"
    }), new FormFieldConfig({
      type: 'dropdown', tooltip: (cfg: any) => {
        return 'Date Type';
      }, value: this.searchQueryData['dateColumn'] ? this.searchQueryData['dateColumn'] : '', defaultDisplayLabel: 'label', defaultOptionsValue: 'value', formName: 'dateColumn', defaultValue: this.translate.instant('dateType'), options: () => { return this.ordersService.datesTypes }, fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12", change: (e: any, item: any) => {
        this.displayDatePickers(e, item);
      }
    }), new FormFieldConfig({
      type: 'datefield', tooltip: (cfg: any) => {
        return 'Start Date';
      }, change: (e: any, cfg: any) => {
        this.populateSearchQuery(moment(e).format('MM/DD/YYYY'), cfg);
      }, minDate: () => { return null }, disabled: (cfg: any) => {
        return this.hideDateField(cfg);
      }, maxDate: () => {
        return this.form && this.form.get('endDate').value ? this.form.get('endDate').value : this.searchQueryData['dateColumn'] && this.searchQueryData['dateColumn'] == 'createTs' ? new Date() : null;
      }, formName: 'startDate', showDefaultDate: true, placeholder: 'mm/dd/yyyy', defaultValue: this.searchQueryData['startDate'] ? moment(this.searchQueryData['startDate']) : moment(new Date()),
      readOnly: () => {
        return 'readonly';
      }, fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm",
    }),
    new FormFieldConfig({
      type: 'datefield', tooltip: (cfg: any) => {
        return 'End Date';
      }, disabled: (cfg: any) => {
        return this.hideDateField(cfg);
      }, change: (e: any, cfg: any) => {
        this.populateSearchQuery(moment(e).format('MM/DD/YYYY'), cfg);
      }, minDate: () => {
        return this.form && this.form.get('startDate').value ? this.form.get('startDate').value : new Date();
      }, maxDate: () => {
        return this.searchQueryData['dateColumn'] && this.searchQueryData['dateColumn'] == 'createTs' ? new Date() : null;
      }, formName: 'endDate', showDefaultDate: true, placeholder: 'mm/dd/yyyy', defaultValue: this.searchQueryData['endDate'] ? moment(this.searchQueryData['endDate']) : moment(new Date()).add(1, 'days'),
      readOnly: () => {
        return 'readonly';
      }, fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm",
    }),
    new FormFieldConfig({
      type: 'dropdown', tooltip: (cfg: any) => {
        return this.translate.instant('supplier');
      }, value: this.searchQueryData['supplierId'] ? this.searchQueryData['supplierId'] : '', defaultDisplayLabel: 'supplierId', defaultOptionsValue: 'supplierId', formName: 'supplierId', defaultValue: this.translate.instant('selectSupplier'), options: () => { return this.supplierObj }, fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12", change: (e: any, item: any) => {
        // this.populateSearchQuery(e, item);
      }, hidden: () => {
        return true;
        // return !this.hideSupplierCombo();
      }
    }), new FormFieldConfig({
      type: 'input', maxlength: 10, keyDown: (e: any, cfg: any) => {
        if (e.key === "Enter") {
          this.populateSearchQuery(e.target.value, cfg);
          // this.search(e);
        }
      }, tooltip: (cfg: any) => {
        return this.translate.instant('orderIdPlaceHolder');
      }, blur: (e: any, cfg: any) => {
        this.populateSearchQuery(e.target.value, cfg);
      }, value: this.searchQueryData['orderId'] ? this.searchQueryData['orderId'] : '', defaultValue: this.searchQueryData['orderId'] ? this.searchQueryData['orderId'] : '', subtype: 'number', min: 0, formName: 'orderId', placeholder: this.translate.instant('orderIdPlaceHolder'), fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm"
    }), new FormFieldConfig({
      type: 'dropdown', tooltip: (cfg: any) => {
        return 'Order Status';
      }, change: (e: any, cfg: any) => {
        this.populateSearchQuery(e, cfg);
      }, value: this.searchQueryData['orderStatusId'] ? this.searchQueryData['orderStatusId'] : '', defaultDisplayLabel: 'description', defaultOptionsValue: 'orderStatusId', formName: 'orderStatusId', defaultValue: this.translate.instant('orderStatusLabel'), options: () => { return this.ordersService.orderTypeStatus }, fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12"
    }),
    new FormFieldConfig({
      type: 'dropdown', tooltip: (cfg: any) => {
        return 'Order Type';
      }, change: (e: any, cfg: any) => {
        this.populateSearchQuery(e, cfg);
      }, value: this.searchQueryData['orderTypeId'] ? this.searchQueryData['orderTypeId'] : '', defaultDisplayLabel: 'description', defaultOptionsValue: 'orderTypeId', formName: 'orderTypeId', defaultValue: this.translate.instant('selectOrderTypeLabel'), options: () => { return this.ordersService.orderTypeOptions }, fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12"
    }),
    new FormFieldConfig({
      type: 'input', tooltip: (cfg: any) => {
        return this.translate.instant('itemNumber');
      }, keyDown: (e: any, cfg: any) => {
        if (e.key === "Enter") {
          this.populateSearchQuery(e.target.value, cfg);
          // this.search(e);
        }
      }, blur: (e: any, cfg: any) => {
        this.populateSearchQuery(e.target.value, cfg);
      }, maxlength: 18, value: this.searchQueryData['productId'] ? this.searchQueryData['productId'] : '', defaultValue: this.searchQueryData['productId'] ? this.searchQueryData['productId'] : '', subtype: 'number', min: 0, formName: 'productId', placeholder: this.translate.instant('itemNumber'), fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm"
    }),
    new FormFieldConfig({
      type: 'input', tooltip: (cfg: any) => {
        return this.translate.instant('supplierItemNumber');
      }, keyDown: (e: any, cfg: any) => {
        if (e.key === "Enter") {
          this.populateSearchQuery(e.target.value, cfg);
          // this.search(e);
        }
      }, blur: (e: any, cfg: any) => {
        this.populateSearchQuery(e.target.value, cfg);
      }, maxlength: 10, value: this.searchQueryData['bic'] ? this.searchQueryData['bic'] : '', defaultValue: this.searchQueryData['bic'] ? this.searchQueryData['bic'] : '', subtype: 'number', min: 0, formName: 'bic', placeholder: this.translate.instant('supplierItemNumber'), fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm"
    }),
    new FormFieldConfig({
      type: 'dropdown', formName: 'retailSectionCode',
      defaultDropDownVal: StaticText.supplierDepartment, defaultDisplayLabel: 'label', defaultOptionsValue: 'value',
      value: this.searchQueryData['retailSectionCode'] ? this.searchQueryData['retailSectionCode'] : '',
      defaultValue: this.searchQueryData['retailSectionCode'] ? this.searchQueryData['retailSectionCode'] : '',
      options: () => { return this.supplierDepartment; },
      fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group required row',
      fieldLabelClass: 'col-md-4 col-form-label', inputClass: "form-control form-control-sm",
      change: (e: any, cfg: any) => {
        // this.onOrderTypeChange(e, cfg);
        this.populateSearchQuery(e, cfg)
      }, disabled: () => {
        return false;
      },
      tooltip: (cfg: any) => {
        return StaticText.supplierDepartment;
      }
    }),
    new FormFieldConfig({
      type: 'dropdown', tooltip: (cfg: any) => {
        return this.translate.instant('operator');
      }, change: (e: any, cfg: any) => {       
        this.populateSearchQuery(e, cfg);
        e == '' && this.form ? this.clearTotalQuantity(e) : '';
      }, value: this.searchQueryData['operator'] ? this.searchQueryData['operator'] : '',
      defaultDisplayLabel: 'label', defaultOptionsValue: 'value', formName: 'operator',
      defaultValue: this.translate.instant('operator'), options: () => { return this.ordersService.totalQuantityDropdown },
      fieldWidthCls: 'col-lg-2 col-md-4', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", fieldWidth: "col-md-12",
     
    }),
    new FormFieldConfig({
      type: 'input', tooltip: (cfg: any) => {
        return this.translate.instant('totalQuantity');
      }, keyDown: (e: any, cfg: any) => {
        if (e.key === "Enter") {
          this.populateSearchQuery(e.target.value, cfg);
          // this.search(e);
        }
      },readOnly: () => {
        return this.form && (this.form.get('operator').value == '' || this.form.get('operator').value == this.translate.instant('operator')) && !this.searchQueryData['operator'];
      }, validation: [Validators.required],
      blur: (e: any, cfg: any) => {
        this.populateSearchQuery(e.target.value, cfg);
      }, maxlength: 10, value: this.searchQueryData['totalQuantity'] ? this.searchQueryData['totalQuantity'] : '', 
      defaultValue: this.searchQueryData['totalQuantity'] ? this.searchQueryData['totalQuantity'] : '', 
      subtype: 'number', min: 0, formName: 'totalQuantity', placeholder: this.translate.instant('totalQuantity'),
      fieldWidthCls: 'col-lg-2 col-md-4', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row',
      fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm",  errorMessages: true,
      isErrorMessageVisible: (item: any) => {
        return this.searchQueryData.operator && this.searchQueryData.operator != '' && this.basicFieldValidation(item);
      },
      displayErrorMessage: (item: any) => {
        return this.searchQueryData.operator && this.searchQueryData.operator != '' && this.displayFormErrorMsg(item);
      },
    }),
    new FormFieldConfig({
      type: 'button', formName: '', fieldWidthCls: 'ml-auto', fieldWidth: "ml-3", btnCls: "btn btn-success", btnText: this.translate.instant('searchBtn'), btnClick: (e) => {
        this.search(e);
      }, disabled: (e) => {
        return this.customErrorVisible(e);
      }
    }),
    new FormFieldConfig({
      type: 'button', formName: '', fieldWidthCls: '', fieldWidth: "mr-3", btnCls: "btn btn-default mr-3", btnText: this.translate.instant('resetBtn'), btnClick: (e) => {
        this.reset(e);
      }
    })
    ]
  }

  clearTotalQuantity = (e) => {
    this.form.get('totalQuantity').setValue('');
    delete this.searchQueryData['totalQuantity'];
  }

  /**
   * basicFieldValidation
   */
  public basicFieldValidation = (item: any): boolean => {
    return this.form && !this.form.get(item.formName).valid;
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
   * disableAField
   */
  public checkIfFieldIsDisable = (formName: string): boolean => {
    return (this.form && this.form.get(formName).value != undefined && this.form.get(formName).value != '') ||
      (this.searchQueryData[formName] && this.searchQueryData[formName] != 0);
  }

  public populateCustomerSupplier = () => {
    this.fetchSupplierInfo(this.searchQueryData['customerGroupId'], { formName: 'customerGroupId' }, false);
    return this.searchQueryData['customerGroupId'];
  }
  /**
  * reset
  */
  public reset = (form: any) => {
    this.form.reset();
    this.searchQueryData = {};
    this.initializeForm();
    this.displayErr = false;
    this.formReset.emit();
  }
  /**
   * fetchForm
   */
  public fetchForm = (form: any) => {
    this.form = form;
  }

  public customErrorVisible = (item: any) => {
    return this.searchQueryData && this.searchQueryData[item.formName];
  }

  public populateSearchQuery = (val: any, cfg: any) => {
    (val != '') ? this.searchQueryData[cfg.formName] = val : (val === '' && this.searchQueryData[cfg.formName]) ? delete this.searchQueryData[cfg.formName] : '';
  }

  public hideDateField = (cfg: any) => {
    let result = false;
    result = this.searchQueryData && this.searchQueryData['dateColumn'];
    (!result) ? this.appendDateInSearch(true, cfg, '') : this.appendDateInSearch(false, cfg, moment(this.form.get(cfg.formName).value).format('MM/DD/YYYY'));
    return !result;
  }
  /**
   * displayDatePickers
   */
  public displayDatePickers = (e: any, item: any) => {
    (e === '' || e == this.translate.instant('dateType')) ? this.appendDateInSearch(true, item, e) : this.appendDateInSearch(false, item, e);
  }
  /**
   * hideSupplierCombo
   */
  public hideSupplierCombo = () => {
    return this.searchQueryData && this.searchQueryData['customerGroupId'];
  }
  /**
   * appendDateInSearch
   */
  public appendDateInSearch = (deleteKey: boolean, item: any, val: any) => {
    (deleteKey) ? delete this.searchQueryData[item.formName] : this.searchQueryData[item.formName] = val;
  }

  public fetchSupplierInfo = (value: any, item: any, triggerSearch: boolean) => {
    let val: string = value;
    this.ordersService.getSupplierInfo(val).subscribe((data: any[]) => {
      this.loadingService.hide();
      let filteredResult: any = {};
      this.populateSearchQuery(value, item);
      filteredResult = data.filter((customer) => { return customer.customerId == val; });
      (filteredResult.length > 0) ? this.populateSupplierInfo(filteredResult[0], true) : this.populateSupplierInfo({}, false);
      (triggerSearch) ? this.search({}) : '';
    })
  }
  /**
   * populateSupplierInfo
   */
  public populateSupplierInfo = (res, displaySupplierDropDown) => {
    this.supplierObj = res && res.suppliers ? res.suppliers : [];
    this.form.get('customerGroupId').setErrors(null);
    (!displaySupplierDropDown) ? this.form.get('customerGroupId').setErrors({ validation: true }) : '';
  }
  /**
   * search
   */
  public search = (e) => {
    this.checkIfRequiredeFieldhasValue() ? this.triggerSearch() : this.searchQueryData.bic || this.searchQueryData.operator ? this.displaySearchErrorMessage('') : this.displaySearchErrorMessage(Messages.searchError.atleastOneField);
  }
  /**
   * checkIfOneFieldhasValue
   */
  public checkIfRequiredeFieldhasValue = (): boolean => {
    let checkFieldObj = Object.assign({}, this.searchQueryData);
    delete checkFieldObj['page']; delete checkFieldObj['limit']; delete checkFieldObj['sortBy'];
    return this.searchQueryData.bic ? this.searchQueryData.supplierId && this.searchQueryData.supplierId != '' : this.searchQueryData.operator ? this.searchQueryData.totalQuantity && this.searchQueryData.totalQuantity != '' : Object.keys(checkFieldObj).length > 0;
  }

  /**
   * displaySearchErrorMessage
   */
  public displaySearchErrorMessage = (msg) => {
    this.displayErr = true;
    this.displayErrMessage = msg;
  }

  public triggerSearch = () => {
    this.displayErr = false;
    this.searchGridData.emit(this.searchQueryData);
  }

  public ngOnDestroy = () => {
    this.ordersService.orderTypeFilter = [];
  }
}
