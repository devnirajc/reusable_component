import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, ElementRef, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit , DoCheck{
  @Input() gridConfig: any;
  @Input() coloumnConfig: any;
  @Input() gridData: any;
  @Output() allItemChecked = new EventEmitter<any>();
  @Output() triggerSortEvent = new EventEmitter<any>();
  @Output() rowSelected = new EventEmitter<any>();
  @Input() stickyHeader: boolean = false;
  public displayCheckBox: boolean;
  public defaultCellWidth: string = '25px';
  public reverseSort: boolean = true;
  public gridCls: string;
  public enableCellEdit: boolean;
  public enableRowEdit: boolean;
  public checkBoxDisable: Function;
  public columnDefs: any;
  public tableOffset: any;
  public widthAdjustmentDone: boolean = false;
  public backgroundColor: string = 'inherit';
  @ViewChild('gridWrapper') gridWrapper : ElementRef;
  public gridWrapperWidth : number;

  constructor(private elRef: ElementRef ,  private cdRef : ChangeDetectorRef) { }

  ngOnInit() {    
    this.defaultGridSettings();   
    this.gridWrapperWidth = this.gridWrapper.nativeElement.offsetWidth;
  }

  ngOnChanges(changes: SimpleChanges) {    
    this.tableOffset = $(".table-grid > tbody").offset().top - $('#content').offset().top;
    changes.gridData && this.stickyHeader ?  this.prepareHeadWidths() : '';
  }  
  /**
   * defaultGridSettings
   */
  public defaultGridSettings = () => {
    let cfg = this.gridConfig.config;
    this.displayCheckBox = cfg.displayCheckBox ? cfg.displayCheckBox : false;
    this.gridCls = cfg.gridCls ? cfg.gridCls : 'table table-striped table-bordered';
    this.enableCellEdit = cfg.cellEdit ? cfg.cellEdit : false;
    this.enableRowEdit = cfg.rowEdit ? cfg.rowEdit : false;
  }
  /**
   * onPaste
   */
  public onPaste = (e: any, cfg: any, index: any) => {
    return (cfg.cellEdit.config.subType === 'number') ? this.isNumber(e) ? this.validateInputLength(e, cfg) ? this.triggerPaste(e, cfg, index) : false : false : this.triggerPaste(e, cfg, index);
    // return item && item.keyPress ? item.keyPress(e,item) : '';
  }
  /**
   * triggerPaste
   */
  public triggerPaste = (e: any, cfg: any, i: any) => {
    return cfg && cfg.cellEdit.config.paste ? cfg.cellEdit.config.paste(e, cfg, i) : '';
  }
  public isNumber = (e: any) => {
    const str = e.clipboardData.getData('text/plain');
    var regEx = new RegExp("^[0-9\s\+]+$");
    return regEx.test(str);
  }
  /**
   * allItemsSelected = 
  =>  */
  public allItemsChecked = () => {
    let cfg: any = this.gridConfig.config;
    return cfg.allItemsChecked ? cfg.allItemsChecked() : false
  }
  /**
   * disabledButton
   */
  public disabledButton = (cfg: any, item: any, index: number) => {
    return cfg.config.disable ? cfg.config.disable(cfg, item, index) : false
  }
  /**
   * noRecord
   */
  public noRecord = () => {
    let cfg: any = this.gridConfig.config;
    return cfg.noRecord ? cfg.noRecord() : 'No data found';
  }
  /**
   * customTemplate
   */
  public customTemplate = (rec: any, colDef: any, index: number) => {
    let result: any;
    (colDef.render) ? result = colDef.render(rec, colDef.name, index, colDef) : result = rec[colDef.name] != undefined || rec[colDef.name] != null ? rec[colDef.name] : '--';
    return result;
  }
  /**
   * cellClick
   */
  public cellClick = (rec, colDef, index: number) => {
    if (!colDef.enableCellClick) {
      return false;
    }
    colDef.cellClick(rec, colDef);
  }
  /**
   * allSelected
   */
  public allSelected = (event) => {
    this.allItemChecked.emit(event);
  }
  /**
   * triggerSort
   */
  public triggerSort = (colDef: any) => {
    if (!colDef.enableSorting || (colDef.enableSorting && this.gridData.length == 0)) {
      return;
    }
    this.triggerSortEvent.emit(colDef);
    colDef.sortDirection = colDef.sortDirection.toLowerCase() === "asc" ? "DESC" : "ASC";
  }
  /**
   * To DisableCheckBox
   */
  public disableCheckBox = (item: any, index: number): boolean => {
    let cfg: any = this.gridConfig.config;
    return cfg.checkBoxDisable ? cfg.checkBoxDisable(item) : (item: any) => { return false };;
  }
  /**
   * rowSelection
   */
  public rowSelection = (...args) => {
    let item: any = args;
    this.rowSelected.emit(item);
  }
  /**
   * gridClass
   */
  public gridClass = () => {
    return this.gridCls;
  }

  /**
   * printValue
   */
  public printValue = (item: any, cfg: any, index: number): string => {
    return (cfg && cfg.cellEdit && cfg.cellEdit.config.value) ? cfg.cellEdit.config.value(item, cfg, index) : item[cfg.name] ? item[cfg.name] : '';
  }
  /**
   * isChecked
   */
  public isChecked = (item: any, cfg: any, index: number, e: any) => {
    return (cfg && cfg.cellEdit && cfg.cellEdit.config.checked) ? cfg.cellEdit.config.checked(item, cfg, index) : '';
  }
  /**
   * onBlur 
   */
  public onBlur = (e, item: any, cfg: any, index: number) => {
    this.updateGridData(index, cfg.name, e.target.value);
    cfg.cellEdit.config.blur ? cfg.cellEdit.config.blur(e, item, cfg, index) : '';
  }
   /**
   * onBlur 
   */
  public onInput = (e, item: any, cfg: any, index: number) => {   
    cfg.cellEdit.config.onInput ? cfg.cellEdit.config.onInput(e, item, cfg, index) : '';
  }
  /**
   * inputClick 
   */
  public inputClick = (e, item: any, cfg: any, index: number) => {
    e.target.value = (cfg.cellEdit.config.checked) ? e.target.checked : e.target.value;
    this.updateGridData(index, cfg.name, e.target.value);
    cfg.cellEdit.config.inputClick ? cfg.cellEdit.config.inputClick(e, item, cfg, index) : '';
  }
  /**
   * updateGridData
   */
  public updateGridData = (i: number, dataIndex: string, value: string) => {
    this.gridData[i][dataIndex] = value;
  }
  /**
   * It will disable input field
   */
  public disableField = (item: any, cfg: any, index: number): any => {
    let result: any;
    result = cfg.cellEdit.config.disabled ? cfg.cellEdit.config.disabled(item, cfg, index) : false;
    return result;
  }
  /**
   * checkTypeofEditableField
   */
  public checkTypeofEditableField = (type: string, cfg: any, index: number): boolean => {
    let result: boolean;
    result = cfg.cellEdit.config.type.toLowerCase() == type;
    return result;
  }
  /**
   * Wll return options value for dropdown
   */
  public printOptonsValue = (cfg: any, index: number): any => {
    return cfg.cellEdit.config.options ? cfg.cellEdit.config.options() : [];
  }

  /**
   * isDisabled
   */
  public isDisabled = (item: any, data: any): boolean => {
    return item && item.cellEdit.config.disabled ? item.cellEdit.config.disabled(item, data) : false;
  }
  /**
   * fetchMaxDate
   */
  public fetchMaxDate = (cfg: any, item: any) => {
    return cfg && cfg.cellEdit.config.maxDate ? cfg.cellEdit.config.maxDate(cfg, item) : '';
  }
  /**
   * minDate
   */
  public fetchMinDate = (cfg: any, item: any) => {
    return cfg && cfg.cellEdit.config.minDate ? cfg.cellEdit.config.minDate(cfg, item) : '';
  }
  /**
   * getInputSubType
   */
  public getInputSubType = (cfg: any, index: number) => {
    return cfg && cfg.cellEdit.config.subType ? cfg.cellEdit.config.subType : 'text';
  }

  /**
   * hidden
   */
  public isHidden = (item: any, data: any): string => {
    return (item && item.cellEdit.config.hidden) ? item.cellEdit.config.hidden(item, data) : false;
  }
  public hideButton = (cfg: any, index: any, item?:any) => {
    return cfg.config.hideBtn ? cfg.config.hideBtn(cfg, index, item) : false;
  }
  /**
   * isReadOnly
   */
  public isReadOnly = (item: any, data: any) => {
    return item && item.cellEdit.config.readOnly ? item.cellEdit.config.readOnly(item, data) : false;
  }
  /**
   * onChange
   */
  public onChange = (e: any, item: any, data: any) => {
    return item && item.cellEdit.config.change ? item.cellEdit.config.change(e, item, data) : '';
  }
  /**
   * toDisplayError
   */
  public toDisplayError = (cfg, index: any): boolean => {
    let errorField = document.getElementsByName(`${cfg.name}_${index}`)[0];
    return cfg && cfg.cellEdit.config.showErrorMsg ? cfg.cellEdit.config.showErrorMsg(cfg, index, errorField) : false;
  }
  /**
   * toDisplayErrorMessage */
  public toDisplayErrorMessage = (cfg: any, index: number): string => {
    let errorField = document.getElementsByName(`${cfg.name}_${index}`)[0];
    return cfg && cfg.cellEdit.config.printErrorMsg ? cfg.cellEdit.config.printErrorMsg(cfg, index, errorField) : '';
  }
  public onInputFocus = (cfg: any, index: number) => {
    return cfg && cfg.cellEdit.config.focus ? cfg.cellEdit.config.focus(cfg, index) : '';
  }
  /**
   * inputIdentifier
   */
  public inputIdentifier = (cfg: any, i: number) => {
    return `${cfg.name}_${i}`;
  }
  /**
     * getInputSubType
     */
  public getInputClass = (cfg: any, index: number) => {
    let inputClass = cfg && cfg.cellEdit.config.inputClass ? cfg.cellEdit.config.inputClass : 'form-control form-control-sm';
    return this.toDisplayError(cfg, index) ? inputClass + ' requiredField' : inputClass;

  }
  /**
   * onKeyUp
   */
  public onKeyUp = (e: any, cfg: any, i: any) => {
    return cfg && cfg.cellEdit.config.keyUp ? cfg.cellEdit.config.keyUp(e, cfg, i) : '';
  }
  /**
   * onKeydown
   */
  public onKeydown = (e: any, cfg: any, i: any) => {
    (e.target.value.length === 0 && e.which === 32) ? e.preventDefault() : '';
    return cfg && cfg.cellEdit.config.keyDown ? cfg.cellEdit.config.keyDown(e, cfg, i) : '';
  }
  /**
   * onKeyPress
   */
  public onKeyPress = (e: any, cfg: any, i: any) => {
    return (cfg.cellEdit.config.subType === 'number') ? this.validateInputNumber(e, cfg) ? this.validateInputLength(e, cfg) ? this.triggerKeyPress(e, cfg, i) : false : false : this.triggerKeyPress(e, cfg, i);
    //return cfg && cfg.cellEdit.config.keyPress ? cfg.cellEdit.config.keyPress(e,cfg,i) : '';
  }

  public validateInputLength = (e: any, item: any) => {
    return item.cellEdit.config.maxlength ? e.target.value.length < item.cellEdit.config.maxlength ? true : false : true;
  }

  /**
   * validateInputNumber
   */
  public validateInputNumber = (e: any, item: any) => {
    const charCode = (e.which) ? e.which : e.keyCode;
    return (charCode > 31 && (charCode < 48 || charCode > 57)) ? false : true;
  }

  public triggerKeyPress = (e: any, cfg: any, i: any) => {
    return cfg && cfg.cellEdit.config.keyPress ? cfg.cellEdit.config.keyPress(e, cfg, i) : '';
  }
  /**
   * setMinimum
   */
  public setMinimum = (cfg: any, i: number) => {
    return cfg && (cfg.cellEdit.config.min || cfg.cellEdit.config.min == 0) ? cfg.cellEdit.config.min : '';
  }

  /**
   * setMax
   */
  public setMaximum = (cfg: any, i: number) => {
    return cfg && cfg.cellEdit.config.max ? cfg.cellEdit.config.max : '';
  }

  /**
  * setMaxLength
  */
  public setMaxLength = (cfg: any, i: number) => {
    return cfg && cfg.cellEdit.config.maxlength ? cfg.cellEdit.config.maxlength : '';
  }

  /**
   * setValue
   */
  public setValue = (cfg: any, item: any) => {
    return cfg && cfg.cellEdit.config.value ? cfg.cellEdit.config.value(cfg, item) : 'MM/DD/YYYY';
  }


  public isObject = (rec: any, colDef: any) => {
    return (typeof rec[colDef.name] == 'object' && rec[colDef.name] != null) ? false : true;
  }

  public getObjectKeys = (rec: any, colDef: any) => {
    return (typeof rec[colDef.name] == 'object') ? Object.keys(rec[colDef.name]) : rec[colDef.name];
  }


  public checkIfObject = (obj: any) => {
    return obj.config.sub_title ? false : true
  }


  public isSubHeader = (config: any) => {
    return config.isSubHeader ? config.isSubHeader : 'N';
  }

  public renderHeader = (config: any) => {
    return config.renderHeader ? config.renderHeader : 'Y';
  }

  public renderColumn = (config: any) => {
    return config.renderColumn ? config.renderColumn : 'Y';
  }

  public isEditable = (item: any, cfg: any, index: number): boolean => {
    let result: boolean;
    result = cfg.editable ? cfg.editable(item, cfg, index) : false;
    return result;
  }

  /** Function calculate colspan value */
  public calColSpan = (config: any) => {
    return config.hasChild ? config.hasChild : "";
  }

  /** Function calculate colspan value */
  public getRowSpan = (cfg: any, item: any, index: number) => {
    return cfg.rowSpan ? cfg.rowSpan(cfg, item, index) : "";
  }

  /** Function calculate colspan value */
  public calRowSpan = (config: any) => {
    return config.hasChild ? "" : "2";
  }

  public prepareHeadWidths = () => {
    $(".table-grid > thead th").each((index) => {
      let w = $(".table-grid > tbody tr:eq(0) td:eq(" + index + ")").width();
      $(".stickyHeader > thead th:eq(" + index + ")").width(w);
    });
  }

 
  public ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
    $(".stickyHeader").hide();
  }

  ngDoCheck(){
    this.gridWrapper.nativeElement.offsetWidth != this.gridWrapperWidth && this.stickyHeader ? this.gridResize() : '';
    this.cdRef.detectChanges();
  }

  gridResize = () => {
    this.gridWrapperWidth = this.gridWrapper.nativeElement.offsetWidth;
    this.prepareHeadWidths();
  }

  scroll = (): void => {    
    let offset = $(window).scrollTop();
    if (offset >= this.tableOffset) {   
      $('.stickyHeader').show();
      this.prepareHeadWidths();
    }
    else {
      $('.stickyHeader').hide();
    }
  };
  
  // debounce function to group multiple sequential call in a single call
  public debounce = (fn: any, delay: any) => {
    let timer = null;
    return function () {
      let context = this;
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }
  
  onResized(event: any): void {
    this.stickyHeader ? this.prepareHeadWidths() : '';
  }

  @HostListener('window:scroll', ['$event'])
  onSroll(event) {  
    if(this.stickyHeader){
      this.scroll();
    }
  }
}