import { Injectable } from '@angular/core';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class JwtService {

  ldapId: any;
  storedToken = localStorage.getItem('jwtToken');
  decoded: any = {};
  constructor() { }

  getToken(): String {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  getTokenExpirationDate(storedToken: string): any {
    this.decoded = jwt_decode(storedToken);
    if (!this.decoded.hasOwnProperty('exp')) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(this.decoded.exp);
    return date;
  }

  isTokenExpired(token?: any): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;
    let date = this.getTokenExpirationDate(token);
    if (date === null) {
      return true;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  getLdapID(): any {
    if(localStorage.getItem('jwtToken')){      
      this.ldapId = localStorage.getItem('jwtToken');
      this.decoded = jwt_decode(this.ldapId);
      if (!this.decoded.hasOwnProperty('LDAPID')) {
        return null;
      } else {
        return this.decoded.LDAPID;
      }
    }
  }

}
