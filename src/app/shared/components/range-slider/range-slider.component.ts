import { Component, OnInit, Input, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnInit {
  public maximumRange: any;
  public minimumRange: any;

  constructor() { }
  @ViewChild('getRangeValue') getRangeValue: any;
  @Input('minRange') minRange: any;
  @Input('maxRange') maxRange: any;
  @Input('rangeWidth') rangeWidth: any;
  @Input('value') value: number = 0;
  @Input() disable : boolean = false; 
  @Output() rangeValue = new EventEmitter<any>();

  ngOnInit() {
    this.minimumRange = this.minRange ? this.minRange : '-100';
    this.maximumRange = this.maxRange ? this.maxRange : '100';
    this.rangeWidth = this.rangeWidth ? this.rangeWidth : '100%';
  }
  public changeZoom = (rangeValue: number) => {
    this.rangeValue.emit(rangeValue);
  }

  public getStyle = () => {
    let styles = {
      'width': this.rangeWidth ? this.rangeWidth : '100%',
    };
    return styles;
  }
}
