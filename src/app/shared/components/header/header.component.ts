import { CookieService } from 'ngx-cookie-service';
import { JwtService } from './../../../core/services/jwt/jwt.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { HeaderConfig } from '@app/shared/config';
import { ManageUserService } from '@app/shared/services';
import { LoaderService, AppConfigService } from '@app/core/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private headers = new HttpHeaders();

  public buildVersion: any;
  public headerData: any;
  public fullName: any;
  public loginUrl = this.appConfiguration.appConfig.loginBaseUrl;
  public domainUrl = this.appConfiguration.appConfig.domainBaseUrl;
  public safewayDomainUrl = this.appConfiguration.appConfig.safewayDomainBaseUrl;
  constructor(private manageUserService: ManageUserService, private jwtService: JwtService, private loaderService: LoaderService, private appConfiguration: AppConfigService, private cookieService: CookieService, private http: HttpClient) {
    this.headers = this.headers.append(
      'DoNotIntercept',
      'true'
    );
  }

  ngOnInit() {
    this.defaultConfig();
    // this.getUserInfoDetails();
    this.getCurrentBuildVersion();
  }

  /**
   * defaultConfig
   */
  public defaultConfig = () => {
    this.headerData = HeaderConfig;
  }

  // public getUserInfoDetails = () => {
  //   this.manageUserService.getUserInfo().subscribe(
  //     (response: any) => {
  //       this.loaderService.hide();
  //       this.fullName = response.FIRST_NAME + ' ' + response.LAST_NAME;
  //     }
  //   )
  // }

  public logoutOMSWindow = () => {
    this.jwtService.destroyToken();
    this.cookieService.deleteAll('/', this.domainUrl);
    this.cookieService.deleteAll('/', this.safewayDomainUrl);
    // window.location.href = this.loginUrl;
  }

  public getCurrentBuildVersion = () => {
    this.http.get('./assets/changes.txt', { headers: this.headers, responseType: 'text' }).subscribe(data => {
      this.buildVersion = data.split('\n').shift();
    });
  }
}