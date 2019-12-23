import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { EndPoints } from '@app/shared/constants';

@Injectable()
export class UtilsService {

  constructor() {

  }
  /**
   * isAlphaNumeric 
   */
  public isAlphaNumeric = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[a-zA-Z0-9]+$');
    return regEx.test(val);
  }

  /**
   * isAlphaNumeric with whitespace only
   */
  public isAlphaNumericWithWhitespace = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[a-zA-Z0-9 ]+$');
    return regEx.test(val);
  }

  /**
   * isAlphaNumeric with whitespace and underscore in between
   */
  public isAlphaNumericWithSpace = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[a-zA-Z0-9_ ]+$');
    return regEx.test(val);
  }



  public regexForHypenCommaSpaceFullstopAndAlphnumeric = (val: string) => {
    let regEx = new RegExp("^[a-zA-Z0-9\d ,.-]*$");
    return regEx.test(val);
  }


  /**
  * Only Alphabates
  */
  public isAlphabetic = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[a-zA-Z]+$');
    return regEx.test(val);
  }

  /**
* Only Alphabates
*/
  public isAlphaNumericWithUnderScore = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[A-Za-z_][_A-Za-z0-9]*$');
    return regEx.test(val);
  }

  /**
  * Only Alphabates
  */
  public isAlphaNumericWithUnderScoreAndHyphen = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[A-Za-z0-9-_]*$');
    return regEx.test(val);
  }

  public isAlphaNumericWithUnderScoreAndHyphenAndSpace = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[-_ a-zA-Z0-9]+$');
    return regEx.test(val);
  }


  /**
  * Only positive negative numbers
  */
  public isNumeric = (event: any, value: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[-]?[0-9]*$');
    return regEx.test(value);
  }

  /**
  * Only numbers
  */
  public isPositiveNumber = (event: any, value: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[0-9]*$');
    return regEx.test(value);
  }

  /**
   * Only non zero positive numbers with decimal
   */
  public isNumberDecimal = (event: any, value: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[0-9]+(\.[0-9]*){0,1}$');
    return regEx.test(value);
  }

  /**
    * Only non zero positive numbers with decimal
    */
  public padZeros = (val: any, len: number) => {
    let strLength = String(val).length;
    return strLength < len ? ('0000' + val).slice(-len) : val;
  }

  /*
  * Not accept zero at first place
  */
  public notToAcceptZeroAtFirst = (event: any,value: any) => {
    if (this.specialKeyCheck(event)) {
      return true;
    }
    let regEx = new RegExp('^[1-9][0-9]*$');
    return regEx.test(value);
  }

  public specialKeyCheck = (event: any) => {
    return ([46, 8, 9, 27, 13, 110].indexOf(event.keyCode) !== -1 ||
      (event.keyCode == 65 && event.ctrlKey === true) ||
      (event.keyCode == 67 && event.ctrlKey === true) ||
      (event.keyCode == 86 && event.ctrlKey === true) ||
      (event.keyCode == 88 && event.ctrlKey === true) ||
      (event.keyCode >= 35 && event.keyCode <= 39)) ? true : false;
  }

  /**
     * isTimeFormat 
     */
  public isTime = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/');
    return regEx.test(val);
  }

  /*
  *
  * including '-' & '_' */
  public allowHypenAndUnderscoreWithAlphaNumeric = (event) => {
    // if(this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[A-Za-z0-9-_]*$');
    return regEx.test(event.key);
  }

  /*
  *
  * including '-' only*/
  public allowHypenWithAlphaNumeric = (event) => {
    // if(this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^[A-Za-z0-9-]*$');
    return regEx.test(event.key);
  }

  /*
  *
  * including '-' only*/
  public NumericPositive = (event) => {
    // if(this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('^(\d?[1-9]|[1-9]0)$');
    return regEx.test(event.key);
  }

  /**
     * formatAndCheckTimePattern
     */
  public formatAndCheckTime(time: string) {
    let result = 'false', m;
    let re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
    if ((m = time.match(re))) {
      result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
    }
    return result;
  }

  public dateTimeRangeValidation = (start: any, end: any) => {
    return start != '' && end != '' ? start >= end ? false : true : true;
  }

   /**
   * Only non zero positive numbers with decimal
   */
  public isNumberDecimalWithoutCharacters = (event: any, value: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp("[0-9](\.[0-9][0-9]?)?$");
    return regEx.test(value);
  }
 /**
  * Character with numbers & '_'
  *  */
  public isCharactersWithUnderScore = (val: string) => {
    if (this.specialKeyCheck(event)) return true;
    let regEx = new RegExp('[a-z A-Z0-9\\_\\"]+$');
    return regEx.test(val);
  }

  /**
  * Character with numbers & '_ & -'
  *  */
 public isCharactersWithUnderScoreDash = (val: string) => {
  if (this.specialKeyCheck(event)) return true;
  let regEx = new RegExp('^[a-zA-Z0-9_-]*$');
  return regEx.test(val);
}

 /**
  * Character with numbers & '_ & -'
  *  */
 public isCharactersWithDash = (val: string) => {
  if (this.specialKeyCheck(event)) return true;
  let regEx = new RegExp('^[a-zA-Z0-9-]*$');
  return regEx.test(val);
}

  /**
   * matchAllSpecialCharacterExcludetield (exclude ~ ` " ')
   */
  public matchAllSpecialCharacterExcludetield = (val: string) => {
    let regEx = new RegExp('^[A-Za-z0-9!@#$&()\\-.+,/][^~`"\']*$');
    return regEx.test(val);
  }

}
