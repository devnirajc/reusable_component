import { Directive, HostListener, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';

@Directive({
  selector: '[appCommonDirective]'
})
export class CommonDirective {

  @Output() appCommonDirective = new EventEmitter();

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @HostListener('window:scroll', ['$event']) private onScroll($event: Event): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

      setTimeout(() => {
        this.appCommonDirective.emit();
      }, 50);

    }

    // setTimeout(function () {
    //   document.documentElement.scrollTop =
    //     document.body.scrollTop =   200
    // }, 2000);

  }
}