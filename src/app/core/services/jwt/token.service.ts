import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class TokenService {
  headers: Headers;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private jwtService: JwtService,
  ) {
  }

  populate() {
    let responseCookie = this.cookieService.get('x-auth-token');
    if (responseCookie) {
      this.setAuth(responseCookie);
    } else {
      this.purgeAuth();
    }
  }

  setAuth(token: any) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(token);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
  }
  
}