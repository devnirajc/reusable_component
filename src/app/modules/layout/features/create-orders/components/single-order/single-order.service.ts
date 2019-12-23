import { Injectable } from '@angular/core';

@Injectable()
export class SingleOrderService {
  public _orderTypeOptions : any = [];
  public _transferTypeOptions : any = [];
  get orderTypeOptions ():any {
    return this._orderTypeOptions; 
  }
  set orderTypeOptions (options : any){
    this._orderTypeOptions = options;
  }
  get transferTypeOptions () :any {
    return this._transferTypeOptions;
  }
  set transferTypeOptions(options : any){
    this._transferTypeOptions = options;
  }
  constructor() { 
    this.orderTypeOptions = [{
      label : 'Rush',
      value : 'rush'
    },{
      label : 'Transfer',
      value : 'transfer'
    }];
    this._transferTypeOptions = [{
      label : 'M1',
      value : 'm1'
    },{
      label : 'M2',
      value : 'm2'
    }]
  }
}
