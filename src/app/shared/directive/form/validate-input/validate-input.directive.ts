import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[validate-input]'
})
export class ValidateInputDirective {
  public regexNum: string = '^[0-9\]+$';
  public regexNumDecimal: string = '^[0-9]+(\.[0-9]*){0,1}$';
  public regexNumInteger: string = '^[-]?[0-9]*$';
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) { }
  @Input() onlyNumber: boolean = false;
  @Input() decimalNumber: boolean = false;
  @Input() positiveNegativeNumber: boolean = false;
  @HostListener('keydown', ['$event'])
  onKeyDown = (event : KeyboardEvent) => {
    //if (this.specialKeys.indexOf(event.key) !== -1) return;
    if([46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
       (event.keyCode == 65 && event.ctrlKey === true) ||
       (event.keyCode == 67 && event.ctrlKey === true) ||
       (event.keyCode == 86 && event.ctrlKey === true) || 
       (event.keyCode == 88 && event.ctrlKey === true) || 
       (event.keyCode >= 35 && event.keyCode <= 39)) return ;
    const charCode = (event.which) ? event.which : event.keyCode;
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    let isValid: boolean = true;
    if (this.onlyNumber) {
      isValid = this.isNumber(next);
    } else if (this.decimalNumber) {
      isValid = this.isDecimalNumber(next, event);
    } else if (this.positiveNegativeNumber) {      
      isValid = this.isPositiveNegativeNumber(next);
    }

    if (isValid)
      return;
    else
      event.preventDefault();
  }
  @HostListener('paste', ['$event'])
  onPaste = (event) => {
    const str = event.clipboardData.getData('text/plain');
    let isValid: boolean = true;
    if (this.onlyNumber) {
      isValid = this.isNumber(str);
    } else if (this.decimalNumber) {
      isValid = this.isDecimalNumber(str);
    } else if (this.positiveNegativeNumber) {
      isValid = this.isPositiveNegativeNumber(str);
    }
    if (isValid)
      return;
    else
      event.preventDefault();
  }
  /**
   * isNumber
   */
  public isNumber = (val: any) => {
    let regEx = new RegExp(this.regexNum);
    return isNaN(val) ? false : regEx.test(val);
  }
  /**
   * isDecimalNumber
   */
  public isDecimalNumber = (val: any, event?: any) => {
    let regEx = new RegExp(this.regexNumDecimal);
    return isNaN(val) ? false : regEx.test(val);
  }

   /**
   * isNumber
   */
  public isPositiveNegativeNumber = (val: any) => {
    let regEx = new RegExp(this.regexNumInteger);
    return regEx.test(val);
  }
  // @HostListener('keydown', ['$event'])
  // acceptNegativeNumber = (e : KeyboardEvent) => { 
  //   if ([69, 187, 188, 189, 190, 110].includes(e.keyCode)) {
  //     e.preventDefault();
  //   }
  //   else if( this.el.nativeElement.value.length == 4 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) return false;
  // }
}
