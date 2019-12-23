import { Injectable } from '@angular/core';
import {Messages} from '@app/shared/constants';
@Injectable()
export class MessagesService {

  constructor() { }

  /**
   * fetchMessage 
   * */
  public fetchMessage = (key : string ,subKey ? : string) : string => {
    let result : string ;
    result = subKey && Messages[key]  ? Messages[key][subKey] : Messages[key] ? Messages[key] : '' ;
    return result;
  }
}
