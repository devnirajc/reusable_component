import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { FormFieldConfig } from '@app/shared/model';
import { StaticText, Messages } from "@app/shared/constants";
import { TranslateService } from "@ngx-translate/core";
import * as moment from 'moment';


@Component({
  selector: 'app-bulk-order-inbox-search',
  templateUrl: './bulk-order-inbox-search.component.html',
  styleUrls: ['./bulk-order-inbox-search.component.scss']
})
export class BulkOrderInboxSearchComponent implements OnInit {

  public data: any;
  public form: any;
  public formFields: any = [];
  public displayErrMessage: string;
  public displayErr: boolean = false;
  public searchParams: any = {};
  //public sortBy: string = 'orderId,DESC';
  public noDataFound: string = this.translate.instant('searchQuery');
  public userId: any;
  @Input() searchQueryData: any = {};
  @Output() formReset = new EventEmitter<any>();
  @Output() fetchBulkOrders = new EventEmitter<any>();

  @Input() queryParams: any;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initializeForm();
  }

   /**
   * fetchForm
   */
  public fetchForm = (form: any) => {
    this.form = form;
  }

  public initializeForm = () => {
    this.formFields = [
      new FormFieldConfig({
        type: 'input', keyDown: (e: any, cfg: any) => {
          if (e.key === 'Enter') {
           this.populateSearchQuery(e.target.value, cfg);
            this.search(e);
          }
        }, blur: (e: any, cfg: any) => {
          this.populateSearchQuery(e.target.value, cfg);
        },
        subtype: 'text',       
        min: 0,
        formName: 'userId',
        placeholder: this.translate.instant('userId'),
        fieldWidthCls: 'col-lg-2 col-md-4',
        fieldWidth: 'col-md-12',
        displayLabelCls: 'form-group required row',
        fieldLabelClass: 'col-md-3 col-form-label',
        inputClass: 'form-control form-control-sm',
        value : this.searchQueryData['userId'] ? this.searchQueryData['userId'] : '',
        tooltip: (cfg: any) => {
          return this.translate.instant('userId');
        },
      }),
      new FormFieldConfig({
        type: 'input', keyDown: (e: any, cfg: any) => {
          if (e.key === 'Enter') {
           this.populateSearchQuery(e.target.value, cfg);
            this.search(e);
          }
        }, blur: (e: any, cfg: any) => {
          this.populateSearchQuery(e.target.value, cfg);
        },
        subtype: 'number',
        min: 0,
        formName: 'batchId',
        placeholder: this.translate.instant('batchId'),
        fieldWidthCls: 'col-lg-2 col-md-4',
        fieldWidth: 'col-md-12',
        displayLabelCls: 'form-group required row',
        fieldLabelClass: 'col-md-3 col-form-label',
        inputClass: 'form-control form-control-sm',
        value : this.searchQueryData['batchId'] ? this.searchQueryData['batchId'] : '',
        tooltip: (cfg: any) => {
          return this.translate.instant('batchId');
        },
      }),
      new FormFieldConfig({
        type: 'datetimefield', 
        tooltip: (cfg: any) => {
          return this.translate.instant('dateAndTime');
        }, 
        change: (e: any, cfg: any) => {       
          e != 'Invalid Date' ? this.populateSearchQuery(moment(e).format('MM/DD/YYYY HH:mm'), cfg) : delete this.searchQueryData['uploadDate'] ;
        }, 
        defaultValue: this.searchQueryData['uploadDate'] ? this.searchQueryData['uploadDate'] : null,
        formName: 'uploadDate', 
        showDefaultDate: (this.searchQueryData['uploadDate']) ? true : false, 
        placeholder: 'MM/DD/YYYY HH:MM', 
        seconds: false, 
        fieldWidthCls: 'col-lg-3 col-md-6', fieldWidth: 'col-md-12', displayLabelCls: 'form-group row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm",
      }),
      new FormFieldConfig({
        type: 'button', formName: 'search', fieldWidthCls: 'ml-auto', fieldWidth: "ml-3", btnCls: "btn btn-success", btnText: "Search", btnClick: (e) => {
         this.search(e);
        },
      }),
      new FormFieldConfig({
        type: 'button', formName: 'reset', fieldWidthCls: '', fieldWidth: "mr-3", btnCls: "btn btn-default mr-3", btnText: "Reset", btnClick: (e) => {
         this.reset(e);
        }
      })
    ]
  }

  /**
   * populate search query
   */
  public populateSearchQuery = (val: any, cfg: any) => {
    (val != '') ? this.searchQueryData[cfg.formName] = val : 
    (val === '' && this.searchQueryData[cfg.formName]) ? delete this.searchQueryData[cfg.formName] : '';
  }

  /**
   * search
   */
  public search = (e) => {
    this.checkIfOneFieldhasValue() ? this.triggerSearch() : this.displaySearchErrorMessage(Messages.searchError.atleastOneField);
  }

  /**
   * checkIfOneFieldhasValue
   */
  public checkIfOneFieldhasValue = (): boolean => {
    return Object.keys(this.searchQueryData).length > 0;
  }

  /**
  * triggerSearch
  */
 public triggerSearch = () => {
  this.displaySearchErrorMessage('');
  this.fetchBulkOrders.emit(this.searchQueryData);
  }

  /**
   * displaySearchErrorMessage
   */
  public displaySearchErrorMessage = (msg) => {
    // this.formReset.emit();
    this.displayErr = true;
    this.displayErrMessage = msg;
  }

  /**
  * reset =
  */
 public reset = (form: any) => {
  this.form.reset();
  this.searchQueryData = {};
  this.initializeForm();
  this.displayErr = false;
  this.formReset.emit();
  this.displayGridErrorMessage(StaticText.searchQuery);
}

/**
  * displayGridErrorMessage
  */
 public displayGridErrorMessage = (msg) => {
  this.noDataFound = msg;
}

}
