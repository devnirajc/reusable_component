import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';


@Component({
  selector: 'app-editable-grid',
  templateUrl: './editable-grid.component.html',
  styleUrls: ['./editable-grid.component.scss']
})
export class EditableGridComponent implements OnInit {

  constructor(private cdRef: ChangeDetectorRef, private eRef: ElementRef) { }
  @Input('editableConfig') editableConfig: any;
  @Input() editableGridConfig: any;
  @Input() gridData: any;
  public gridCls: string = 'table-grid table table-striped table-bordered';
  public checkBoxDisable: Function;
  public columnDefs: any;
  public setClickedValue: any;
  public colum: any;
  public row: any;
  public backgroundColor: string = 'inherit';
  public valueExist: any;

  ngOnInit() {
    this.defaultGridSettings();
  }

  public ngDoCheck() {
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    this.editableConfig && this.editableConfig.length > 0 && document.getElementById("addColspan") ? document.getElementById("addColspan").setAttribute("colspan", (this.editableConfig.length + 1)) : '';
  }

  /**
   * defaultGridSettings
   */
  public defaultGridSettings = () => {
    let cfg = this.editableGridConfig.config;
    this.gridCls = cfg.gridCls ? cfg.gridCls : 'table table-bordered';
  }

  /**
   * gridClass
   */
  public gridClass = () => {
    return this.gridCls;
  }

  /**
   * isEditable
   */
  public isEditable = (item: any, cfg: any, index: number): boolean => {
    let result: boolean;
    result = cfg.editable ? cfg.editable(item, cfg, index) : false;
    return result;
  }

  public checkTypeofEditableField = (type: string, cfg: any, index: number): boolean => {
    let result: boolean;
    result = cfg.editCell.config.type.toLowerCase() == type;
    return result;
  }

  public getBackgroundColor = (item: any, cfg: any, index: number): any => {
    let result: any;
    this.backgroundColor = !this.isEditable(item, cfg, index) ? "#F0F0F0" : "#FFFFFF";
    result = cfg.backgroundColor ? cfg.backgroundColor : this.backgroundColor;
    return result;
  }

  public hasClass = (cfg: any): any => {
    return cfg.hasClass ? cfg.hasClass : 'text-center align-top';
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
    let cfg: any = this.editableGridConfig.config;
    return cfg.noRecord ? cfg.noRecord() : 'No data found';
  }

  /**
  * printValue
  */
  public printValue = (item: any, cfg: any, index: number): string => {
    return (cfg && cfg.editCell && cfg.editCell.config.value) ? cfg.editCell.config.value(item, cfg, index) : item[cfg.name] ? item[cfg.name] : '';
  }

  /** Get set input value*/
  public getSetInputValue = (rec: any, colDef: any, index: number) => {
    let result: any;
    (colDef.render) ? result = colDef.render(rec, colDef.name, index, colDef) : result = rec[colDef.name] != undefined || rec[colDef.name] != null ? rec[colDef.name] : '--';
    return result;
  }

  public customTemplate = (rec: any, colDef: any, index: number) => {
    let result: any;
    (colDef.render) ? result = colDef.render(rec, colDef.name, index, colDef) : result = rec[colDef.name] != undefined || rec[colDef.name] != null ? rec[colDef.name] : '--';
    return result;
  }

  public isSubHeader = (config: any) => {
    return config.isSubHeader ? config.isSubHeader : 'N';
  }

  public showField = (config: any) => {
    return config.showField ? config.showField : false;
  }

  public renderColumn = (config: any, item:any, index: number) => {
    return typeof config.renderColumn === 'string' ? config.renderColumn :  typeof config.renderColumn === 'function' ? config.renderColumn(config, item, index) : 'Y';  
  }

  public renderHeader = (config: any) => {
    return config.renderHeader ? config.renderHeader : 'Y';
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
   * Double cellClick
   */
  public editCellClick = (e: any, rec: any, colDef: any, index: any, colum: any, row: any, key: number) => {
    if (this.colum != colum) {
      setTimeout(() => document.getElementById(colDef.name + '_' + index) ? document.getElementById(colDef.name + '_' + index).focus() : '', 0);
    }
    if (colum && row) {
      document.getElementById(colDef.name + '-' + index).setAttribute('dirty','true')
      this.colum = colum;
      this.row = row;
    }
  }

  /** Get conditionally backgroung color */
  public getConditionalyBackgroundColor = (rec: any, colDef: any, index: number) => {
    let result: any;
    (colDef.render) ? result = colDef.render(rec, colDef.name, index, colDef) : result = rec[colDef.name] != undefined || rec[colDef.name] != null ? rec[colDef.name] : '--';
    return result == null || colDef.editable == false ? "#F0F0F0" : "#FFFFFF";
  }
  /**
   * isChecked
   */
  public isChecked = (item: any, cfg: any, index: number, e: any) => {
    return (cfg && cfg.editCell && cfg.editCell.config.checked) ? cfg.editCell.config.checked(item, cfg, index) : '';
  }
  /**
   * onBlur 
   */
  public onBlur = (e, item: any, cfg: any, index: number) => {
    cfg.editCell.config.blur ? cfg.editCell.config.blur(e, item, cfg, index) : '';
  }
  /**
   * onBlur 
   */
  public inputClick = (e, item: any, cfg: any, index: number) => {
    e.target.value = (cfg.editCell.config.checked) ? e.target.checked : e.target.value;
    //  this.updateGridData(index, cfg.name, e.target.value);
    cfg.editCell.config.inputClick ? cfg.editCell.config.inputClick(e, item, cfg, index) : '';
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
    result = cfg.editCell.config.disabled ? cfg.editCell.config.disabled(item, cfg, index) : false;
    return result;
  }

  /**
   * Wll return options value for dropdown
   */
  public printOptonsValue = (cfg: any, index: number): any => {
    return cfg.editCell.config.options ? cfg.editCell.config.options() : [];
  }

  /**
   * isDisabled
   */
  public isDisabled = (item: any, data: any): boolean => {
    return item && item.editCell.config.disabled ? item.editCell.config.disabled(item, data) : false;
  }
  /**
   * fetchMaxDate
   */
  public fetchMaxDate = (cfg: any, item: any) => {
    return cfg && cfg.editCell.config.maxDate ? cfg.editCell.config.maxDate(cfg, item) : '';
  }
  /**
   * minDate
   */
  public fetchMinDate = (cfg: any, item: any) => {
    return cfg && cfg.editCell.config.minDate ? cfg.editCell.config.minDate(cfg, item) : '';
  }
  /**
   * getInputSubType
   */
  public getInputSubType = (cfg: any, index: number) => {
    return cfg && cfg.editCell.config.subType ? cfg.editCell.config.subType : 'text';
  }

  /**
   * hidden
   */
  public isHidden = (item: any, data: any): string => {
    return (item && item.editCell.config.hidden) ? item.editCell.config.hidden(item, data) : false;
  }
  public hideButton = (cfg: any, index: any) => {
    return cfg.config.hideBtn ? cfg.config.hideBtn(cfg, index) : false;
  }
  /**
   * isReadOnly
   */
  public isReadOnly = (item: any, data: any) => {
    return item && item.editCell.config.readOnly ? item.editCell.config.readOnly(item, data) : false;
  }
  /**
   * onChange
   */
  public onChange = (e: any, item: any, data: any) => {
    return item && item.editCell.config.change ? item.editCell.config.change(e, item, data) : '';
  }
  /**
   * toDisplayError
   */
  public toDisplayError = (cfg, index: any): boolean => {   
    let errorField = cfg && cfg.editCell && cfg.editCell.config.showErrorMsg ? document.getElementById(cfg.name + '-' + index) : '';
    return cfg && cfg.editCell && cfg.editCell.config.showErrorMsg ? cfg.editCell.config.showErrorMsg(cfg, index, errorField) : false;
  }
  /**
   * toDisplayErrorMessage */
  public toDisplayErrorMessage = (cfg: any, index: number): string => {
    let errorField = cfg && cfg.editCell && cfg.editCell.config.printErrorMsg ? document.getElementById(cfg.name + '-' + index) : '';
    return cfg && cfg.editCell && cfg.editCell.config.printErrorMsg ? cfg.editCell.config.printErrorMsg(cfg, index, errorField) : '';
  }

  public onInputFocus = (cfg: any, index: number) => {
    return cfg && cfg.editCell.config.focus ? cfg.editCell.config.focus(cfg, index) : '';
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
    let inputClass = cfg && cfg.editCell.config.inputClass ? cfg.editCell.config.inputClass : 'form-control form-control-sm';
    return this.toDisplayError(cfg, index) ? inputClass + ' requiredField' : inputClass;

  }
  /**
   * onKeyUp
   */
  public onKeyUp = (e: any, cfg: any, i: any) => {
    return cfg && cfg.editCell.config.keyUp ? cfg.editCell.config.keyUp(e, cfg, i) : '';
  }
  /**
   * onKeydown
   */
  public onKeydown = (e: any, cfg: any, i: any) => {
    (e.target.value.length === 0 && e.which === 32) ? e.preventDefault() : '';
    return cfg && cfg.editCell.config.keyDown ? cfg.editCell.config.keyDown(e, cfg, i) : '';
  }
  /**
   * onKeyPress
   */
  public onKeyPress = (e: any, cfg: any, i: any) => {
    return (cfg.editCell.config.subType === 'number') ? this.validateInputNumber(e, cfg) ? this.validateInputLength(e, cfg) ? this.triggerKeyPress(e, cfg, i) : false : false : this.triggerKeyPress(e, cfg, i);
    //return cfg && cfg.editCell.config.keyPress ? cfg.editCell.config.keyPress(e,cfg,i) : '';
  }

  public validateInputLength = (e: any, item: any) => {
    return item.editCell.config.maxlength ? e.target.value.length < item.editCell.config.maxlength ? true : false : true;
  }

  /**
   * validateInputNumber
   */
  public validateInputNumber = (e: any, item: any) => {
    const charCode = (e.which) ? e.which : e.keyCode;
    return (charCode > 31 && (charCode < 48 || charCode > 57)) ? false : true;
  }

  public triggerKeyPress = (e: any, cfg: any, i: any) => {
    return cfg && cfg.editCell.config.keyPress ? cfg.editCell.config.keyPress(e, cfg, i) : '';
  }
  /**
   * setMinimum
   */
  public setMinimum = (cfg: any, i: number) => {
    return cfg && (cfg.editCell.config.min || cfg.editCell.config.min == 0) ? cfg.editCell.config.min : '';
  }

  /**
   * setMax
   */
  public setMaximum = (cfg: any, i: number) => {
    return cfg && cfg.editCell.config.max ? cfg.editCell.config.max : '';
  }

  public removeFocusFromEditableCell = () => {
    this.row = 0;
    this.colum = 0;
  }

  /**
  * setMaxLength
  */
  public setMaxLength = (cfg: any, i: number) => {
    return cfg && cfg.editCell.config.maxlength ? cfg.editCell.config.maxlength : '';
  }

  /**
   * setValue
   */
  public setValue = (cfg: any, item: any) => {
    return cfg && cfg.editCell.config.value ? cfg.editCell.config.value(cfg, item) : 'MM/DD/YYYY';
  }


  public isObject = (rec: any, colDef: any) => {
    return (typeof rec[colDef.name] == 'object' && rec[colDef.name] != null) ? true : false;
  }

  public getObjectKeys = (rec: any, colDef: any) => {
    return (typeof rec[colDef.name] == 'object' && rec[colDef.name] != null) ? Object.keys(rec[colDef.name]) : rec[colDef.name];
  }

  public getObjectKey = (obj: any) => {
    return Object.keys(obj);
  }


  public checkIfObject = (obj: any) => {
    return obj.config.sub_title ? false : true
  }

  public getColDef = (cfgName: any) => {
    return this.editableConfig.filter((obj) => {
      return obj.config.name == cfgName;
    })
  }

  public fetchToolTip = (e: any) => { 
    return e.tooltip ? e.tooltip(e) : '';
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.row = 0;
      this.colum = 0;
    }
  }
}