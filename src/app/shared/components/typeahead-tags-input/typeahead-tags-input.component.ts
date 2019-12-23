import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-typeahead-tags-input',
  templateUrl: './typeahead-tags-input.component.html',
  styleUrls: ['./typeahead-tags-input.component.scss']
})
export class TypeaheadTagsInputComponent implements OnInit {
  @Input() formName : string;
  @Input() tooltip : string = 'Tags';
  @Input() removeLastOnBackspace : boolean = true;
  @Input() canDeleteTags : boolean = true;
  @Input() placeholder : string = 'Choose your options';
  @Input() minLengthBeforeOptions : number  = 2;
  @Input() scrollableOptions : boolean = true;
  @Input() scrollableOptionsInView : number = 10;
  @Input() fieldWidthCls : string = "form-control form-control-sm";
  @Input() options : any = ['TOG1' , 'TOG2', 'TOG3' , 'TOG4' , 'TOG5' , 'TOG6' , 'TOG7' , 'TOG8' , 'TOG9' , 'TOG10']
  @Input() tags : any = [];
  @Output() maxTagsReached = new EventEmitter<any>();
  @Output() tagsChanged = new EventEmitter<any>();
  @Output() noOptionMatched = new EventEmitter<any>();
  

  constructor() { }

  ngOnInit() {

  }

  public onTagsChanged = (e:any) => {
    this.tagsChanged.emit(e);
  }

  public onMaxTagsReached = (e:any) => {
    this.maxTagsReached.emit(e);
  }

  public onNoOptionsMatch = (e:any) => {
    this.noOptionMatched.emit(e);
  }

}
