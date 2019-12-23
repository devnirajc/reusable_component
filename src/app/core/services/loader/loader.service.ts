import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface LoaderState {
  show: boolean;
}

@Injectable()
export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();
  constructor() { }
  /**
     * This method will show loader
     */
  public show = () => {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  /**
   * This method will hide loader
   */
  public hide = () => {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }
}
