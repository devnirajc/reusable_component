import { Directive, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy, OnChanges , SimpleChanges} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as $ from 'jquery';

@Directive({
  selector: '[appInfiniteScroll]'
})

export class InfiniteScrollDirective implements OnInit, OnDestroy, OnChanges {
  @Input() scrollDistance: number = 95;
  @Input() debounceTime = 500;
  @Input() stopDataScroll: boolean = false; 
  @Input() infiniteScrollEnable : boolean = false;
  @Input() showLoader : boolean = false;
  @Output() scroll = new EventEmitter();
  private scrollEvent = new Subject();
  private subscription: Subscription;  
  public throttlescroll: any;
  differ: any;

  constructor() {       
  }

  ngOnInit() {
    this.infiniteScrollEnable ? this.initializeThrottleScroll() : '';
  }

  ngOnChanges(changes: SimpleChanges) {
    this.infiniteScrollEnable ? changes.showLoader.currentValue ?  this.appendLoader() : this.removeLoader() : '';
  }

  public initializeThrottleScroll = () => {
    this.subscription = this.scrollEvent.pipe(
      debounceTime(1000)
    ).subscribe(e =>  this.throttlescroll(e));
  }

  @HostListener('window:scroll', ['$event']) private onScroll($event: Event): void {    
    if(this.infiniteScrollEnable){
        this.throttlescroll = (event: any) => {     
        event.preventDefault();
        event.stopPropagation();     
        let scrolledPer = this.get_scroll_percentage();
        !this.stopDataScroll && scrolledPer >= this.scrollDistance ? this.scrollEventStart() : '';
      }
      this.scrollEvent.next(event);
    }
  }

  public scrollEventStart = () => { 
    this.scroll.emit();       
  }

  public appendLoader = () => {
      let loaderHtml = '<div id="overlay-loader" class="row"><div class="loader-image"><img src="./assets/images/loader.gif"></div></div>';
      $('#content').append(loaderHtml);
  }

  public removeLoader = () => {
     $('#overlay-loader').remove();
  }

  /**
 * Get current browser viewpane heigtht
 */
  public get_window_height = () => {
    return window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight || 0;
  }

  /**
 * Get current absolute window scroll position
 */
  public get_window_Yscroll = () => {
    return window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop || 0;
  }

  /**
 * Get current absolute document height
 */
  public get_doc_height = () => {
    return Math.max(
      document.body.scrollHeight || 0,
      document.documentElement.scrollHeight || 0,
      document.body.offsetHeight || 0,
      document.documentElement.offsetHeight || 0,
      document.body.clientHeight || 0,
      document.documentElement.clientHeight || 0
    );
  }

  /**
 * Get current vertical scroll percentage
 */
  public get_scroll_percentage = () => {
    return (
      (this.get_window_Yscroll() + this.get_window_height()) / this.get_doc_height()
    ) * 100;
  }  

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : '';
    $('#overlay-loader').html() ? $('#overlay-loader').remove() : '';
    window.removeEventListener('scroll', this.onScroll, true);
  }
}
