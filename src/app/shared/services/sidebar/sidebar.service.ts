import { Injectable } from '@angular/core';
@Injectable()
export class SidebarService {
  private _sidebarData: any
  get SidebarData() {
    return this._sidebarData;
  }
  set SidebarData(data: any) {
    this._sidebarData = data;
  }
  private _homeUrl : String;
  get HomeUrl(){
    return this._homeUrl;
  }
  set HomeUrl(url){
    this._homeUrl = url;
  }
  constructor() { }
  /**
   * setHomeUrl
   * this function will set the firs link in the sidebar component has the home url
   */

  public setHomeUrl = () => {
    let result: String;
    let menuLink: any = this.SidebarData && this.SidebarData[0] ? this.SidebarData[0] : [];
    result = `${Object.keys(menuLink).length > 0 ? menuLink.sub != null ? menuLink.sub[0].link : menuLink.link : ''}`;
    result = result.charAt(0) == '/' ? result.substr(1) : result;
    this.HomeUrl = result;
  }
}
