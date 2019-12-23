import { Component, OnInit, forwardRef, Output, Input, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap'

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TagsInputComponent),
  multi: true
}
const noop = () => {};

@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TagsInputComponent implements OnInit {

  private selected:string = '';
  public tags: any[] = [];
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @Input() maxTags: number;
  @Input() removeLastOnBackspace: boolean = false;
  @Input() canDeleteTags: boolean = true;
  @Input() placeholder: string = '';
  @Input() options: any = null;
  @Input() displayField: string = 'displayValue';
  @Input() allowDuplicates: boolean = false;
  @Input() minLengthBeforeOptions: number = 1;
  @Input() scrollableOptions: boolean = false;
  @Input() scrollableOptionsInView: number = 5;
  @Output() onTagsChanged = new EventEmitter();
  @Output() onMaxTagsReached = new EventEmitter();
  @Output() onNoOptionsMatch = new EventEmitter();
    
  constructor() { }

  ngOnInit() {}

  private getPlaceHolder(): string {
      if(this.tags && this.tags.length > 0){
          return '';
      }
      return this.placeholder;
  }

  private tagsChanged(type: string, tag: any): void {
      this.onChangeCallback(this.tags);
      this.onTagsChanged.emit({
          change: type,
          tag: tag
      });
      if(this.maximumOfTagsReached()){
          this.onMaxTagsReached.emit();
      }
  }

  private removeLastTag(tagInput: HTMLInputElement): void {
      if(!this.removeLastOnBackspace || !this.tags.length) {
          return;
      }

      if (tagInput.value === ''){
          this.removeTag(this.tags[this.tags.length-1]);
      }
  }

  private addTag(tagInput: HTMLInputElement): void {     
      if (tagInput.value.trim() !== ''){
          let tag = {
              [this.displayField]: tagInput.value
          };
          this.addPredefinedTag(tag);
      }
      tagInput.value = '';
  }

  private addPredefinedTag(tag: Object): void {
      if (!this.maximumOfTagsReached()){
          this.tags.push(tag);
          this.tagsChanged('add', tag);
      }
  }

  private removeTag(tagToRemove: any): void {
      if(!this.isDeleteable(tagToRemove)){
          return;
      }
      this.tags = this.tags.filter(tag => tagToRemove !== tag);
      this.tagsChanged('remove', tagToRemove);
  }

  private maximumOfTagsReached(): boolean {
      return typeof this.maxTags !== 'undefined' && this.tags.length>=this.maxTags;
  }

  private isDeleteable(tag: any) {
      if(typeof tag.deleteable !== "undefined" && !tag.deleteable){
          return false;
      }
      return this.canDeleteTags;
  }

  private typeaheadOnSelect(e:TypeaheadMatch):void {      
      let isAlreadyPresent = this.tags.filter(obj => obj.displayValue === e.value);
      let allowAddTags = this.allowDuplicates ? true : !isAlreadyPresent.length;     
      if(allowAddTags){
        if(typeof e.item === 'string'){
            this.addPredefinedTag({
                [this.displayField]: e.value
            });
        }else {
            this.addPredefinedTag(e.item);
        }
        this.selected = '';
      }     
  }

  private typeaheadOnNoMatch(e:any):void {
      if(typeof this.onNoOptionsMatch !== 'undefined'){
          this.onNoOptionsMatch.emit(e)
      }
  }

  writeValue(value: any) {
      if (value !== this.tags) {
          this.tags = value;
      }
  }

  registerOnChange(fn: any) {
      this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
      this.onTouchedCallback = fn;
  }

}
