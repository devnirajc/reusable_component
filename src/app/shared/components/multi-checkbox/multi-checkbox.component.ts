import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-multi-checkbox',
  templateUrl: './multi-checkbox.component.html',
  styleUrls: ['./multi-checkbox.component.scss']
})
export class MultiCheckboxComponent implements OnInit {

  @Input() options : any = [];
  @Input() selectedValues: string;
  @Output() toggle = new EventEmitter<any[]>();
  @Input() formName : string;
  @Input() alignment : string;
  @Input() defaultDisplayLabel: string;
  @Input() defaultOptionsValue: string;
  checkedValues : any;

  constructor() { }

  ngOnInit() {
    this.checkedValues = this.selectedValues != '' ? this.selectedValues.split(',') : [];
  }

  onToggle(e: any, item: any) {
    let index = this.checkedValues.indexOf(e.target.value);
    e.target.checked && index == -1 ? this.checkedValues.push(e.target.value) : !e.target.checked && index > -1 ? this.checkedValues.splice(index, 1) : '';
    this.toggle.emit(this.checkedValues);
  }

  public defaultValueSelection = (item: any) => {
    return this.checkedValues.indexOf(item[this.defaultOptionsValue].toString()) > -1 ? true : false;
  }

  /**
   * optionsValue
   */
  public optionsValue = (item: any) => {
    return item && item[this.defaultOptionsValue];
  }
  /**
   * optionsLabel
   */
  public optionsLabel = (item: any) => {
    return item && item[this.defaultDisplayLabel];
  }

  

}
