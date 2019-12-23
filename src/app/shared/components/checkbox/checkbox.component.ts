import { Component, OnInit, Input, Output, EventEmitter, ContentChild, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Output() isClicked = new EventEmitter();
  @Input('checkboxLabel') checkboxLabel: any;
  @Input('checkboxValue') checkboxValue: boolean = false;
  @Input('checkboxName') checkboxName: any;
  @Output('actionOnSelect') actionOnSelect = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public isChecked = (event) => {  
    this.checkboxValue = event.target.checked;
    if(event){
      this.actionOnSelect.emit(event);
    }
  }

}
