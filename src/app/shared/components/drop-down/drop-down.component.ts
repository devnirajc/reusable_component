import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
  constructor(private titlecasePipe: TitleCasePipe) { }
  public styleObject;
  @Input() value: string;
  @Input() name: string;
  @Input() formControlName: string;
  @Input() disabled: string;
  @Input() hidden: string;
  @Input() required: string;
  @Input() inputClass: string;
  @Input() defaultDisplayLabel: string;
  @Input() defaultOptionsValue: string;
  @Input('receivedInputData') receivedInputData: any;
  @Input('defaultValue') defaultValue: any;
  @Input('defaultSelectHeight') defaultSelectHeight: any;
  @Input('defaultSelectWidth') defaultSelectWidth: any;
  @Output('selectedInputData') selectedInputData = new EventEmitter<any>();

  ngOnInit() {
    this.receivedInputData = this.receivedInputData ? this.receivedInputData : [];

    this.defaultValue = this.defaultValue ? this.defaultValue : 'Select';
  }

  public onChange = (selectedValue: any) => {
    this.selectedInputData.emit(selectedValue);
  }

  public onFocusOut = (selectedValue: any) => {
    (selectedValue == '' || selectedValue == null) ? this.selectedInputData.emit(selectedValue) : '';
  }
  /**
   * optionsValue
   */
  public optionsValue = (item: any) => {
    return this.defaultOptionsValue && item[this.defaultOptionsValue] ? item[this.defaultOptionsValue] : item;
  }
  /**
   * optionsLabel
   */
  // public optionsLabel = (item: any) => {
  //   return this.defaultDisplayLabel && item[this.defaultDisplayLabel] ? item[this.defaultDisplayLabel] : item;
  //   // return item && item[this.defaultDisplayLabel];
  // }

  public optionsLabel = (item: any) => {
    return (this.defaultDisplayLabel && item[this.defaultDisplayLabel] && typeof item[this.defaultDisplayLabel] === 'string') ? this.titlecasePipe.transform(item[this.defaultDisplayLabel]) : (this.defaultDisplayLabel && item[this.defaultDisplayLabel] && typeof item[this.defaultDisplayLabel] === 'number') ? item[this.defaultDisplayLabel] : (this.defaultDisplayLabel && item[this.defaultDisplayLabel]) ? item : '';
  }

  public defaultValueSelection = (item: any) => {
    let dataVal = item[this.defaultOptionsValue] ? item[this.defaultOptionsValue] : item;
    return this.value == dataVal ? true : null;
  }
}
