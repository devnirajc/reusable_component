import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../jwt/token.service';
//import {LoaderService} from '@app/core/services';
@Injectable()
export class AppConfigService {
  private _appConfig;
  private _appSettings;

  set appConfig(data) {
    this._appConfig = data;
  }
  get appConfig(): any {
    return this._appConfig;
  }

  set appSettings(data) {
    this._appSettings = data;
  }
  get appSettings(): any {
    return this._appSettings;
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
   }

  loadAppConfig() {    
    this.setTitle();
    this.tokenService.populate();  
    return this.initializeAppConfiguration(); 
  }

  public initializeAppConfiguration = () => {
    return this.http.get('./assets/json/env-config.json')
      .toPromise()
      .then(data => {
        this._appConfig = data;
        this.initializeSettingConfiguration();
      });
  }

  public initializeSettingConfiguration = () => {
    return this.http.get('./assets/json/config.json')
    .toPromise()
    .then(data => {
      this._appSettings = data;
    });
  }
  /**
   * appInitializerFn
   */
  public appInitializerFn = () => {
    return () => {
      return this.loadAppConfig();
    };
  }

  public setTitle = () => {
    if (window.location.href.indexOf("dev") > -1) {
      document.title = "OMS-DEV";
    } else if (window.location.href.indexOf("qa") > -1) {
      document.title = "OMS-QA";
    } else if (window.location.href.indexOf("prod") > -1) {
      document.title = "OMS-PROD";
    } else {
      document.title = "OMS-UI";
    }
  }
}
