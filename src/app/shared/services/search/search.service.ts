import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {
  private _searchParams: any;
  get searchParams(): any {
    return this._searchParams;
  }
  set searchParams(params: any) {
    this._searchParams = params;
  }
  constructor() { }
}
