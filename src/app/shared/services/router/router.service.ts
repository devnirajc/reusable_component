import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class RouterService {
  public history: any = [];
  private _queryParams: any;
  get queryParams(): any {
    return this._queryParams
  }
  set queryParams(params) {
    this._queryParams = params;
  }
  constructor(public router: Router, public acitvatedRoute: ActivatedRoute) { }

  navigateTo(url: String): void {
    this.router.navigate([url]);
  }
  public fetchQueryParams = (): any => {
    let queryParam: any;
    this.acitvatedRoute.queryParamMap.subscribe(params => {
      queryParam = params;
    });
    return queryParam;
  }

  public navigateURlQueryParams = (url: any, params: any) => {
    this.router.navigate(url, params);
  }

  public navigateURlWithQueryParams = (url: any, params: any) => {
    this.router.navigate([url], { queryParams: params });
  }
  /**
   * pushInHistory 
   */
  public pushInHistory = (url) => {
    this.history.push(url);
  }
  public popHistory = (): any => {
    return this.history.pop();
  }

}