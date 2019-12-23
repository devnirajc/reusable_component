import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { RouterModule } from '@angular/router';
import {
  LoginComponent,
  NotFoundComponent,
  SignUpComponent,
  LoaderComponent
} from './components';
import {
  AuthGuardService,
  HttpInterceptorsService,
  LoaderService,
  JwtService,
  TokenService
} from './services';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppConfigService } from "@app/core/services/config";
import { DialogService } from "@app/shared/components";

import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from "ngx-bootstrap";
const appInitializerFn = (appConfig: AppConfigService) => {
  return appConfig.appInitializerFn();
};
@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  declarations: [LoginComponent, NotFoundComponent, SignUpComponent, LoaderComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorsService,
    multi: true
  }, LoaderService, AuthGuardService, AppConfigService, DialogService, BsModalService, JwtService, TokenService, {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFn,
    multi: true,
    deps: [AppConfigService]
  }],
  exports: [
    RouterModule,
    LoaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule { }
