import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DualListBtnConfig } from "@app/shared/model";

@Component({
  selector: 'app-dual-list',
  templateUrl: './dual-list.component.html',
  styleUrls: ['./dual-list.component.scss']
})
export class DualListComponent implements OnInit {
  @Input() source: any = [];
  @Input() allDataHeading : string = "All Customers";
  @Input() selectedDataHeading : string = "Selected Customers";
  @Input() destination: any = [];
  @Input() buttonsList: any[];
  @Input() displaySourceLabel: string;
  @Input() key : string;
  @Input() config : any;
  @Input() displayLabel : Function;
  @Input() displaySourceValue: string;
  @Input() displayDesitnationLabel: string;
  @Input() displayDestiantionValue: string;
  @Input() sourcePlaceHolder: string = 'Search Customer';
  @Input() destinationPlaceHolder: string = 'Search Customer';
  @Input() noDestData: string = "No data found";
  @Input() noSourceData: string = "No data found";
  @Output() deletedFromDestination = new EventEmitter<any>();
  @Output() addToDestination = new EventEmitter<any>();
  @Output() selectedItem = new EventEmitter<any>();
  public sourceData: any[];
  public sourceSearchText: string = '';
  public destSearchText: string = ''
  public destinationData: any[];
  public selectedDestination: any[];
  public selectedSource: any[];
  public buttons: any[];
  public defaultButtonClass: string = 'btn btn-outline-primary btn-sm';

  constructor() { }

  ngOnInit() {
    this.initializeDualListButtons();
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (changes['source']) {
      this.assignOBject(changes['source'].currentValue, 'sourceData');
    }
    if (changes['destination']) {
      this.assignOBject(changes['destination'].currentValue, 'destinationData');
    }
  }
  public getMoveUpBtn = (): any => {
    return new DualListBtnConfig({
      iconCls: 'fa fa-chevron-left',
      iconTooltip: 'Move left',
      text: '',
      click: (e) => {

      },
      disabled: (e) => {

      }
    });
  }
  public getMoveTopBtn = (): any => {
    return new DualListBtnConfig({
      iconCls: 'fa fa-chevron-left',
      iconTooltip: 'Move left',
      text: '',
      click: (e) => {

      },
      disabled: (e) => {

      }
    });
  }
  /**
   * checkIfItemExist = 
ary   */
  public checkIfItemExist = (ary : any , e:any) => {
    ary.forEach(element => {

    })
  }
  /**
   * moveSelectedItems
   */
  public moveSelectedItems = (fromArry: any[], toArry: any[], parentFromAry: any[], parentToAry: any[], src ? : string) => {
    let unDeletedRecords: any = [];
    fromArry.forEach((el, i) => {
      if (el.selected) {
        (this.checkItemExistInDestination(parentToAry,el)) ? '' : parentToAry.push(el);
        el.selected= false;
        let index: any = '';
        parentFromAry.forEach((item, ind) => {
          (el[this.key] == item[this.key]) ? index = ind : '';
        });
        (index != '') ? parentFromAry.splice(index, 1) : (index == 0) ? parentFromAry.splice(0, 1) : '';
      }
    });
    this.sourceSearchText == '' ? this.assignOBject(this.source, 'sourceData') : this.filterRecord('sourceData', 'source', this.sourceSearchText, this.displaySourceLabel, src  );
    this.destSearchText == '' ? this.assignOBject(this.destination, 'destinationData') : this.filterRecord('destinationData', 'destination', this.destSearchText, this.displayDesitnationLabel, src);
    //fromArry = Object.assign([],unDeletedRecords);
  }
  public getMoveToDestBtn = (): any => {
    return new DualListBtnConfig({
      iconCls: 'fa fa-chevron-right',
      iconTooltip: 'Move right',
      text: '',
      click: (e) => {
        this.moveSelectedItems(this.sourceData, this.destinationData, this.source, this.destination , 'sourceLabel');
        this.addToDestination.emit();
      },
      disabled: (e) => {
        return this.disbaleActionBtnFromTo(this.sourceData);
      }
    });
  }
  public getMoveToSourceBtn = (): any => {
    return new DualListBtnConfig({
      iconCls: 'fa fa-chevron-left',
      iconTooltip: 'Move left',
      text: '',
      click: (e) => {
        this.moveSelectedItems(this.destinationData, this.sourceData, this.destination, this.source, 'destinationLabel');
        this.deletedFromDestination.emit();
      },
      disabled: (e) => {
        return this.disbaleActionBtnFromTo(this.destinationData);
      }
    });
  }
  public disbaleActionBtnFromTo = (iterateAry: any[]): boolean => {
    let result: boolean = false;
    iterateAry.forEach(el => {
      result = result || (el.selected ? el.selected : false);
    });
    return !result;
  }
  public initializeDualListButtons = () => {
    this.buttons = [];
    this.buttonsList.forEach(el => {
      let btn: any;
      switch (el) {
        case 'moveUp': btn = this.getMoveUpBtn(); break;
        case 'moveTop': btn = this.getMoveTopBtn(); break;
        case 'moveToSource': btn = this.getMoveToSourceBtn(); break;
        case 'moveToDestination': btn = this.getMoveToDestBtn(); break;
        default: break;
      }
      this.buttons.push(btn);
    });
  }
  /**
   * assignOBject
   */
  public assignOBject = (source, dest) => {
    this[dest] = Object.assign([], source);
  }
  /**
   * deleteUser
   */
  public deleteUser = () => {
    this.deletedFromDestination.emit();
  }
  /**
   * addUser
   */
  public addUser = () => {
    this.addToDestination.emit();
  }
  /**
   * onItemClick
   */
  public onItemClick = (item: any, ary: any) => {
    item.selected = item.selected ? !item.selected : true;
    this.selectedItem.emit({ data: item, selection: ary });
  }
  /**
   * displayLabel
   */
  public displayListLabel = (item: any, label: string,src : string) => {
    return this.config && this.config[src] ? this.config[src](item) : item[label];
  }
  /**
   * iconCls
   */
  public getBtnIconCls = (item: any) => {
    return item && item.iconCls ? item.iconCls.toLowerCase() : "btn btn-default";
  }

  /**
   * getBtnText
   */
  public getBtnText = (item: any) => {
    return item && item.text ? item.text : "";
  }
  public getBtnClick = (e: any, cfg: any) => {
    return cfg && cfg.click ? cfg.click() : '';
  }
  /**
   * isDisabled
   */
  public isDisabled = (cfg: any) => {
    return cfg && cfg.disabled ? cfg.disabled() : '';
  }
  /**
   * hideButton
   */
  public hideButton = (cfg: any) => {
    return cfg && cfg.hidden ? cfg.hidden() : '';
  }
  /**
   * isItemSelected
   */
  public isItemSelected = (item: any) => {
    return item.selected ? 'active' : '';
  }
  public onKeyUp = (e: any, ary: any, key: string, destAry: any, text: string, src : string) => {
    !e.target.value || e.target.value == '' ? this.assignOBject(this[ary], destAry) : this.filterRecord(destAry, ary, e.target.value, key, src);
    this[text] = e.target.value;
  }
  /**
   * filterRecord
   */
  public filterRecord = (destAry: string, ary: string, val: string, key: string, src? : string) => {   
    this[destAry] = Object.assign([], this[ary]).filter(
      item => {
        let srcText = this.config && this.config[src] ? this.config[src](item) : item[key];       
        return srcText.toLowerCase().indexOf(val.trim().toLowerCase()) > -1
      }
    )
  }
  /**
   * checkItemExistInDestination
   */
  public checkItemExistInDestination = (ary,item  :any) => {
    let isExist : boolean = false;
    ary ? ary.forEach(el =>{
      isExist = isExist || (el[this.key] == item[this.key]);
    }) : '';
    return isExist;
  }
  public checkActiveCustomers = () => {
    let count : number = 0;
    this.sourceData.forEach(el => {
      (this.checkItemExistInDestination(this.destination,el)) ? count = count + 1 : '';
    })
    return (this.sourceData.length - count) == 0;
  }
}
