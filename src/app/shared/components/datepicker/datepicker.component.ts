import { Component, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html', changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

  public defaultDate: any;
  @Input() datepickerCls: string;
  @Input() placeholder: any;
  @Input() isDisabled: boolean = false;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() dateFormat: any;
  @Input() readonly: string;
  @Input() value: any;
  @Output() change = new EventEmitter<any>();
  @Input() showDefaultDate: boolean;

  constructor() { }

  ngOnInit() {
    this.placeholder = this.placeholder ? this.placeholder : "Select Date";
    this.datepickerCls = this.datepickerCls ? this.datepickerCls : "form-control";
    this.isDisabled = this.isDisabled ? true : false;
    this.minDate = this.minDate ? this.minDate : '';
    this.maxDate = this.maxDate ? this.maxDate : '';
    this.readonly = this.readonly ? 'readonly' : '';
    this.dateFormat = this.dateFormat ? this.dateFormat : 'mm/dd/yyyy';
    (this.showDefaultDate) ? this.defaultDate = this.value ? moment(this.value).toDate() : new Date() : '';
    document.body.style.overflowX = "hidden";
  }

  public dateValue = () => {
    return (this.showDefaultDate) ? this.defaultDate = this.value ? new Date(this.value) : new Date() : '';
  }
  /**
   * Date value onchange event
   */
  public onValueChange(value: Date) {
    this.change.emit(value);
  }

}
