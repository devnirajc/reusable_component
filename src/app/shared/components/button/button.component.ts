import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() text : string = '';
  @Input() cls : string = '';
  @Input() iconClass : string = '';
  @Input() previousIconClass : string = '';
  @Input() iconTooltip : string = '';
  @Input() disabled : boolean = false;
  @Input() hidden : boolean =false;
  @Output() onButtonClick  = new EventEmitter<any>(); 
  constructor() { }

  ngOnInit() {
    
  }
  /**
   * buttonClick
   */
  public buttonClick = (e:any) => {
    this.onButtonClick.emit(e);
  }

}
