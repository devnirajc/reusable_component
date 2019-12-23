import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from '@app/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClient } from "@angular/common/http";
import { WebpackTranslateLoader } from '@app/core/services/config/webpack-translate-loader';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CookieService } from '../../node_modules/ngx-cookie-service';
import { AccessRightService } from '@app/shared/services';
// import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterService } from '@app/shared/services/toaster/toaster.service';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
// export class CustomOption extends ToastOptions {
//   positionClass = 'screen-center'
// }
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    AngularFontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
  ],
  providers: [AccessRightService, CookieService, ToasterService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class AppBootstrapModule { }
