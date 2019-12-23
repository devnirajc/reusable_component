/**
 * To use a component this are the following input parameter
 * 
 */
import { Component, OnInit, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerConfig, NgbTimeStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
@Component({
  selector: 'app-datetimepickerwrapper',
  templateUrl: './datetimepickerwrapper.component.html',
  styleUrls: ['./datetimepickerwrapper.component.scss'],
  providers: [NgbDatepickerConfig, NgbTimepickerConfig]
})
export class DatetimepickerwrapperComponent implements OnInit {
  @Input() datepickerCls: string;
  @Input() placeholder: any = "MM/DD/YYYY HH:MM:SS";
  @Input() isDisabled: boolean = false;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() dateFormat: string = "MM/DD/YYYY";
  @Input() timeFormat: string;
  @Input() readonly: string = "readonly";
  @Input() disabled: string = "";
  @Input() value: any;
  @Input() showDefaultDate: boolean = true;
  @Input() datePicker: boolean = true;
  @Input() meridian: boolean = true;
  @Input() timePicker: boolean = false;
  @Input() showSpinners: boolean = true;
  @Input() seconds: boolean = true;
  @Input() outsideDays: any;
  @Input() showWeekDays: boolean;
  @Input() readonlyInputs: boolean = true;

  @Output() change = new EventEmitter<any>();
  @Output() navigaton = new EventEmitter<any>();
  
  @Input() showCalendarSetting: any;
  public displayDropDown: boolean = false;
  public datePickerModel: NgbDateStruct;
  public timePickerModel: NgbTimeStruct;
  public date: { year: number, month: number };
  public startDate;
  private dateValue: Date;
  public showCalendar:boolean = true;


  constructor(private el: ElementRef, public dateConfig: NgbDatepickerConfig, public timeConfig: NgbTimepickerConfig) { }

  ngOnInit() {
   // this.showCalendarSetting != undefined &&  this.showCalendarSetting != true ? this.placeholder = "HH:MM:SS" : this.placeholder = "MM/DD/YYYY HH:MM:SS" 
    this.meridian = this.meridian != undefined ? this.meridian : true;
    this.timeFormat = this.meridian != undefined ? 'HH:mm:ss' : 'hh:mm:ss A';
    this.showCalendar =  this.showCalendarSetting != undefined ? this.showCalendarSetting : this.showCalendar;
    //this.placeholder = this.seconds ? this.placeholder : "HH:MM";
    this.timeFormat = this.seconds ? this.timeFormat : "HH:mm";
    this._datePickerConfig();
    this._inputValueSettings();
    //this.seconds == false ? this.placeholder = "HH:MM" ? this.timeFormat = "HH:MM" : "HH:MM:SS" : "HH:MM:SS";
  }

  ngDoCheck = () => {}

  private _datePickerConfig = () => {
    this.dateConfig.minDate = this.minDate ? this.formatDateForDatePicker(this.minDate) : { year: 1900, month: 1, day: 1 };
    this.dateConfig.maxDate = this.maxDate ? this.formatDateForDatePicker(this.maxDate) : { year: 2099, month: 12, day: 31 };
    this.dateConfig.outsideDays = this.outsideDays ? this.outsideDays : 'visible';
    this.dateConfig.showWeekdays = this.showWeekDays ? this.showWeekDays : true;
  }

  private _inputValueSettings = () => {
    this.dateValue = this.value ? this.value : '';
    this._populateInputField();
  }

  public formatDateForDatePicker = (date: any): NgbDateStruct => {  
    return {
      year: Number(moment(date).format('YYYY')),
      month: Number(moment(date).format('MM')),
      day: Number(moment(date).format('DD'))
    };
  }

  public _formnatTimeForDatePicker = (date: any): NgbTimeStruct => {
    return {
      hour: Number(moment(date).format('HH')),
      minute: Number(moment(date).format('mm')),
      second: Number(moment(date).format('ss'))
    }
  }
  
  public timePickerClick = () => {
    this.displayDropDown = !this.displayDropDown;
    const _dateVal = this.dateValue ? moment(this.dateValue) : new Date();
    this.datePickerModel = this.formatDateForDatePicker(_dateVal);
    this.timePickerModel = this._formnatTimeForDatePicker(_dateVal);
  }

  private _defaultSettings = () => {
    this.displayDropDown = false;
    this.showCalendar =  this.showCalendarSetting ? this.showCalendarSetting : this.showCalendar;
  }

  public onDateTimeSelection = () => {
    this._populateDate();
    this._populateInputField();
    this.change.emit({ date: this.dateValue });
  }

  private _populateDate = () => {
    const _selectedDate = new Date(this.datePickerModel.year, this.datePickerModel.month - 1, this.datePickerModel.day, this.timePickerModel.hour, this.timePickerModel.minute, this.timePickerModel.second);
    this.dateValue = _selectedDate;
  }

  private _populateInputField = () => {

    const _dateValue =  this.showCalendarSetting != undefined &&  this.showCalendarSetting != true  ? this.dateValue ? moment(this.dateValue).format(`${this.timeFormat}`) : '' : this.dateValue ? moment(this.dateValue).format(`${this.dateFormat} ${this.timeFormat}`) : '';
    this.el.nativeElement.querySelector("input").value = _dateValue;
  }

  public navigate = ($event: any) => {
    this.date = $event.next;
    this.navigaton.emit({
      event: $event,
      date: this.date
    })
  }

  @HostListener('document:click', ['$event'])
  onClick = (event) => {
    if (!this.el.nativeElement.contains(event.target)) {
      let dateTimeToEmit =  this.showCalendarSetting == true || this.showCalendarSetting == undefined ? new Date(this.el.nativeElement.querySelector("input").value) : this.el.nativeElement.querySelector("input").value;
      this.change.emit( dateTimeToEmit ? dateTimeToEmit : '');
      this._defaultSettings();
    } else {
      let dateTimeToEmit =  this.showCalendarSetting == true || this.showCalendarSetting == undefined ? new Date(this.el.nativeElement.querySelector("input").value) : this.el.nativeElement.querySelector("input").value;
      this.change.emit( dateTimeToEmit ? dateTimeToEmit : '');
    }
  }
}
