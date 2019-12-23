import { Component, OnInit, Input, Output, ContentChild, TemplateRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: ['./radio-input.component.scss']
})
export class RadioWithAnyInputComponent implements OnInit {

  @Input('radioLabel') radioLabel: any;
  @Input('radioValue') radioValue: any;
  @Input('radioName') radioName: any;
  @Input('checked') checked: boolean = false;

  @ContentChild('inputTemplate') inputTemplate: TemplateRef<any>;
  @Output('actionOnSelect') actionOnSelect = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public isChecked = (event) => {
    if(event){
      this.actionOnSelect.emit(event);
    }
  }
  
}
