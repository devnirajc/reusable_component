import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  @Input() value: any;
  @Input() name: any;
  @Input() disabled : boolean;
  @Output() valueChange = new EventEmitter<any>();

  changeValue(value) {
    this.value = value;
    this.valueChange.emit(value);
  }
  constructor() { }

  ngOnInit() {
  }

}
