import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  constructor() { }
  @Input('schedulerConfig') schedulerConfig: any;
  @Input() schedulerGridConfig: any;
  @Input() schedulerGridData: any;
  public gridCls: string;
  public checkBoxDisable: Function;
  public columnDefs: any;
  public getSubArray: any[] = [];

  ngOnInit() {
    this.defaultGridSettings();
  }

 
  /**
   * defaultGridSettings
   */
  public defaultGridSettings = () => {
    let cfg = this.schedulerGridConfig.config;
    this.gridCls = cfg.gridCls ? cfg.gridCls : 'table table-striped table-bordered';
  }

  /**
   * gridClass
   */
  public gridClass = () => {
    return this.gridCls;
  }

  /**
   * noRecord
   */
  public noRecord = () => {
    let cfg: any = this.schedulerGridConfig.config;
    return cfg.noRecord ? cfg.noRecord() : 'No data found';
  }

  /**
  * printValue
  */
  public printValue = (item: any, cfg: any, index: number): string => {
    return (cfg && cfg.cellEdit && cfg.cellEdit.config.value) ? cfg.cellEdit.config.value(item, cfg, index) : item[cfg.name] ? item[cfg.name] : '';
  }

  public customTemplate = (rec: any, colDef: any, index: number) => {
    let result: any;
    (colDef.render) ? result = colDef.render(rec, colDef.name, index, colDef) : result = rec[colDef.name] != undefined || rec[colDef.name] != undefined || rec[colDef.name] != null ? rec[colDef.name] : '--';
    return result;
  }

  public isObject = (rec: any, colDef: any) => {
    return (typeof rec[colDef.name] == 'object') ? false : true;
  }

  public getObjectKeys = (rec: any, colDef: any) => {
    return (typeof rec[colDef.name] == 'object') ? Object.keys(rec[colDef.name]) : rec[colDef.name];
  }

  /** Function calculate colspan value */
  public calColSpan = (config: any) => {
    return config.sub_title ? Object.keys(config.sub_title).length : "";
  }


  /** Function calculate colspan value */
  public calRowSpan = (config: any) => {
    return config.sub_title ? "" : "2";
  }


  public checkIfObject = (obj: any) => {
    return obj.config.sub_title ? false : true
  }

}
