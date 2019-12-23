import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { FormConfig } from '.';
import { TypeaheadMatch, TypeaheadDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public form: FormGroup;
  @Input() formFields: any = [];
  @Output() fetchForm = new EventEmitter<any>();
  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; }
  get value() { return this.form.value; }
  public defaultFieldWidthCls: string = '';
  public loader : boolean = false;
  public defaultDisplayLabelCls: string = "";
  public defaultInputSubType: string = 'text';
  public alignment: string = 'vertical';
  //@ViewChild('typeahead') typeahead: TypeaheadDirective;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }
  initializeForm = () => {
    this.form = this.createGroup();
    this.fetchForm.emit(this.form);
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (changes['formFields']) {
      changes['formFields'].currentValue ? this.initializeForm() : '';
    }
  }
  createGroup() {
    const group = this.formBuilder.group({});
    this.formFields.forEach(control => group.addControl(control.config.formName, this.createControl(control.config)));
    return group;
  }
  createControl(config: FormConfig) {
    let { disabled, validation, defaultValue } = config;
    return this.formBuilder.control({ value: defaultValue, disabled: disabled }, validation);
  }
  /**
   * This method will set the width of the field
   * formFieldWidth
   */
  public formFieldWidth = (item: any): string => {
    return item && item.fieldWidthCls ? item.fieldWidthCls : this.defaultFieldWidthCls;
  }

  /**
   * This method will set the width of the field
   * fetchFieldClass
   */
  public fetchFieldClass = (item: any): string => {
    return this.toDisplayError(item) ? item.inputClass + ' requiredField' : item.inputClass;
  }


  /**
   * isReadOnly
   */
  public isReadOnly = (item: any) => {
    return item && item.readOnly ? item.readOnly() : false;
  }

  public showLoader = (item:any) => {
    return item && item.showLoader ? item.showLoader() : this.loader;
  }

  /**
   * tabIndex
   */
  public tabIndex = (item: any) => {
    return item && item.tabIndex ? item.tabIndex() : 0;
  }
  /**
   * fieldLabelCls
   */
  public fieldLabelCls = (cfg: any) => {
    return cfg.fieldLabelClass ? cfg.fieldLabelClass : '';
  }
  /**
   * inputClass
   */
  public inputClass = (cfg: any) => {
    let inputCls = cfg.inputClass ? cfg.inputClass : '';
    return this.toDisplayError(cfg) ? inputCls + ' requiredField' : inputCls;
  }

  public fieldWidth = (cfg: any) => {
    return cfg.fieldWidth ? cfg.fieldWidth : '';
  }
  /**
   * this method will set the label inline or block
   * displayLabelInline
   */
  public displayLabelInline = (item: any): string => {
    return item && item.displayLabelCls ? item.displayLabelCls : this.defaultDisplayLabelCls;
  }

  public onNoOptionsMatch = (e: any, item: any) => {
    return item && item.noOptionMatch ? item.noOptionMatch(e, item) : '';
  }

  public onTagsChanged = (e: any, item: any) => {
    return item && item.noOptionMatch ? item.tagsChanged(e, item) : '';
  }

  public onMaxTagsReached = (e: any, item: any) => {
    return item && item.noOptionMatch ? item.maxTagsReached(e, item) : '';
  }
  /**
   * Will print field label
   * printFieldLabel
   */
  public printFieldLabel = (item: any) => {
    return item && item.renderLabel ? item.renderLabel(item) : item.label ? item.label : '';
  }
  /**
   * get Input sub type
   */
  public getInputSubType = (item: any) => {
    return item && item.subtype ? item.subtype.toLowerCase() : this.defaultInputSubType;
  }
  /**
   * onBlur
   */
  public onBlur = (e: any, item: any) => {
    (item && item.blur) ? item.blur(e, item) : '';
  }
  /**
   * onClick
   */
  public onClick = (e: any, item: any) => {
    (item && item.click) ? item.click(e, item) : '';
  }
  /**
   * populateNameField
   */
  public populateNameField = (cfg) => {

    return cfg ? cfg.formName : '';
  }
  /**
   * hidden
   */
  public isHidden = (item: any): string => {
    return (item && item.hidden) ? item.hidden(item) : false;
  }
  public inputValue = (item: any) => {
    return item && item.value ? item.value : '';
  }
  /**
   * isDisabled
   */
  public isDisabled = (item: any): boolean => {
    return item && item.disabled ? item.disabled(item) : false;
  }
  /**
   * onKeyUp
   */
  public onKeyUp = (e: any, item: any) => {
    return item && item.keyUp ? item.keyUp(e, item) : '';
  }
  /**
   * onKeydown
   */
  public onKeydown = (e: any, item: any) => {
    const charCode = (e.which) ? e.which : e.keyCode;
    (e.target.value.length === 0 && charCode === 32) ? e.preventDefault() : '';
    return item && item.keyDown ? item.keyDown(e, item) : '';
  }

  /**
   * onKeydown
   */
  public onInput = (e: any, item: any) => {
    const charCode = (e.which) ? e.which : e.keyCode;
    (e.target.value.length === 0 && charCode === 32) ? e.preventDefault() : '';
    return item && item.onInput ? item.onInput(e, item) : '';
  }
  /**
   * onKeyPress
   */
  public onKeyPress = (e: any, item: any) => {
    return (item.subtype === 'number') ? this.validateInputNumber(e, item) ? this.validateInputLength(e, item) ? this.triggerKeyPress(e, item) : false : false : this.triggerKeyPress(e, item);
    // return item && item.keyPress ? item.keyPress(e,item) : '';
  }
  /**
   * onPaste
   */
  public onPaste = (e: any, cfg: any) => {
    return (cfg.subtype === 'number') ? this.isNumber(e) ? this.validateInputLength(e, cfg) ? this.triggerPaste(e, cfg) : false : false : this.triggerPaste(e, cfg);
    // return item && item.keyPress ? item.keyPress(e,item) : '';
  }
  /**
   * triggerPaste
   */
  public triggerPaste = (e: any, cfg: any) => {
    return cfg && cfg.paste ? cfg.paste(e, cfg) : '';
  }

  public isNumber = (e: any) => {
    const str = e.clipboardData.getData('text/plain');
    var regEx = new RegExp("^[0-9\s\+]+$");
    return regEx.test(str);
  }
  //(paste)=”pasteUrl($event.clipboardData.getData(‘text/plain’))”
  /**
   * validateInputNumber
   */
  public validateInputLength = (e: any, item: any) => {
    // let len = e.target.value.length;
    return item.maxlength ? e.target.value.length < item.maxlength ? true : false : true;
  }

  /**
   * validateInputNumber
   */
  public validateInputNumber = (e: any, item: any) => {
    const charCode = (e.which) ? e.which : e.keyCode;
    return (charCode > 31 && (charCode < 48 || charCode > 57)) ? false : true;
    // return !((e.keyCode > 95 && e.keyCode < 106)
    //   || (e.keyCode > 47 && e.keyCode < 58) 
    //   || e.keyCode == 8) ? false : true;
  }

  public triggerKeyPress = (e: any, item: any) => {
    return item && item.keyPress ? item.keyPress(e, item) : '';
  }
  /**
   * onChange
   */
  public onChange = (e: any, item: any) => {
    this.form.get(item.formName).setValue(e);
    return item && item.change ? item.change(e, item) : '';
  }
  /**
   * toDisplayErrorMessage
   */
  public toDisplayError = (item: any): boolean => {
    return item && item.isErrorMessageVisible ? item.isErrorMessageVisible(item) : false;
  }
  /**
   * toDisplayError
   */
  public toDisplayErrorMessage = (item: any) => {
    return item && item.displayErrorMessage ? item.displayErrorMessage(item) : 'Required';
  }
  /**
   * printPlaceHolder 
   */
  public printPlaceHolder = (cfg: any): string => {
    return cfg.placeholder ? cfg.placeholder : '';
  }
  /**
   * fetchMaxDate
   */
  public fetchMaxDate = (cfg: any) => {
    return cfg && cfg.maxDate ? cfg.maxDate(cfg) : '';
  }
  /**
   * minDate
   */
  public fetchMinDate = (cfg: any) => {
    return cfg && cfg.minDate ? cfg.minDate(cfg) : '';
  }
  /**
   * fetchOptions
   */
  public fetchOptions = (cfg: any) => {
    return cfg && cfg.options ? cfg.options(cfg) : '';
  }
  /**
   * setMinimum
   */
  public setMinimum = (cfg: any) => {
    return cfg && (cfg.min || cfg.min == 0) ? cfg.min : '';
  }

  /**
   * setMax
   */
  public setMaximum = (cfg: any) => {
    return cfg && cfg.max ? cfg.max : '';
  }

  /**
   * setMaxLength
   */
  public setMaxLength = (cfg: any) => {
    return cfg && (cfg.maxlength || cfg.maxlength == 0) ? cfg.maxlength : '';
  }

  /**
   * getBtnCls
   */
  public getBtnCls = (item: any) => {
    return item && item.btnCls ? item.btnCls.toLowerCase() : "btn btn-default";
  }

  /**
   * getBtnText
   */
  public getBtnText = (item: any) => {
    return item && item.btnText ? item.btnText : "Sample Text";
  }

  /**
   * getBtnClick
   */
  public getBtnClick = (e: any, item: any) => {
    return item.btnClick ? item.btnClick(e, item) : '';
  }
  /**
   * fetchToolTip
   * */
  public fetchToolTip = (e: any) => {
    return e.tooltip ? e.tooltip(e) : '';
  }

  public defaultValue = (cfg: any) => {
    return cfg && cfg.defaultDropDownVal ? cfg.defaultDropDownVal : cfg.defaultValue;
  }

  public typeahead = (e: any) => {
    return e.typeahead ? e.typeahead : '';
  }

   /**
   * onToogle
   */
  public onToggle = (e: any, cfg:any) => {
    (cfg && cfg.change) ? cfg.change(e, cfg) : '';
  }
}
