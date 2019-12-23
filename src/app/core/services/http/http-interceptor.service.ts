import { JwtService } from './../jwt/jwt.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '@app/core/services/loader/loader.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { of } from 'rxjs/observable/of';
import { DialogService } from "@app/shared/components/modal-dialog/modal-dialog.service";
import { AppConfigService } from "@app/core/services/config/app-config.service";
import { ToasterService } from "@app/shared/services/toaster/toaster.service";

@Injectable()
export class HttpInterceptorsService implements HttpInterceptor {
    constructor(private loaderService: LoaderService, private dialogService: DialogService, private jwtService: JwtService, private AppConfiguration: AppConfigService, private toaster: ToasterService) { }
    location: boolean;
    addToken(req: HttpRequest<any>): HttpRequest<any> {
        req = this.deleteInterceptHeader(req);
        return req.clone({ setHeaders: { 'x-auth-token': `${this.jwtService.getToken()}` } })
    }

    deleteInterceptHeader(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({ headers: req.headers.delete('DoNotIntercept') });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.location = req.url.indexOf("assets/json") > -1;
        // if (this.jwtService.isTokenExpired() && !this.location) {
        //     window.location.href = this.AppConfiguration.appConfig.loginBaseUrl;
        // }
        req.headers.has('DoNotIntercept') ? '' : this.loaderService.show();
        req = this.addToken(req);
        req = req.method === 'GET' ? this.createCustomeRequest(req) : req;
        return next.handle(req)
            .catch(error => {
                this.loaderService.hide();
                if (error instanceof HttpErrorResponse) {
                    if (this.is2xxStatus(error)) {
                        return this.prepareNullBodyFor2xxSeries(error);
                    } else {
                        this.validateError(error);
                    }
                } else {
                    return Observable.throw(error);
                }
            });
        //}
    }

    /**
     * createCustomeRequest
     */
    public createCustomeRequest = (req: HttpRequest<any>) => {
        const customRequest = req.clone({
            headers: req.headers.set('Cache-Control', 'no-cache')
                .set('Pragma', 'no-cache')
        });
        return customRequest;
    }
    /**
     * prepareNullBodyFor2xxSeries 
     */
    public prepareNullBodyFor2xxSeries = (error: any) => {
        return of(new HttpResponse({
            headers: error.headers,
            status: error.status,
            statusText: error.statusText,
            url: error.url
        }));
    }
    /**
     * validateError 
     */
    public validateError = (error) => {
        switch ((<HttpErrorResponse>error).status) {
            case 403:
                return this.handleError(error, false);
            case 401:
                return this.handleError(error, false);
            case 400:
                return this.handleAttributeError(error, false);
            case 406:
                return this.handleSOSError(error, false);
            default: return this.handleError(error, false)
        }
    }
    handleSOSError = (err: any, logOut: any) => {
        if (err.error.status == 'NOT_ACCEPTABLE') {
            let msg = 'SOS already exists';
            this.toaster.showError(msg, '', 'auto', true, 4000);
        } else {
            let msg = 'Service error occurred!';
            this.toaster.showError(msg, '', 'auto', true, 4000);
        }
        throw new Error(err);
    }
    handleAttributeError = (err: any, logOut: any) => {
        if (err.error.message == 'Rule already defined for combination ITEMQTY_MAX, verify your request.') {
            let msg = 'Rule is already defined! Please verify your request.';
            this.toaster.showError(msg, '', 'auto', true, 4000);
        } else if (err.error.message == 'Invalid JSON Request') {
            let msg = 'Invalid JSON Request';
            this.toaster.showError(msg, 'Error', 'auto', true, 4000);
        } else if (err.error.message == 'Rule already defined for combination ORDERQTY_MAX, verify your request.') {
            let msg = 'Rule is already defined! Please verify your request.';
            this.toaster.showError(msg, '', 'auto', true, 4000);
        } else if (err.error.message == 'Rule already defined for combination ON_HOLD, verify your request.') {
            let msg = 'Rule is already defined! Please verify your request.';
            this.toaster.showError(msg, '','auto', true, 4000);
        } else if (err.error.errors[0].errorMessage == 'effectiveDate: Effective Date must be present or future date') {
            let msg = 'Effective Date must be present or future date.';
            this.toaster.showError(msg, '', 'auto', true, 4000);
        } else {
            let msg = 'Service error occurred!';
            this.toaster.showError(msg, 'Error', 'auto', true, 4000);
        }
        throw new Error(err);
    }
    handleError = (err: any, logOut: any) => {
        if (logOut) {
            //To implement Modal popup
            //this.loginService.logOutUser();
            // this.showModal('Session Expired','Error');
        } else {
            let msg = 'Service error occurred!';
            this.toaster.showError(msg, 'Error', 'auto', true, 4000);
        }
        throw new Error(err);
    }
    /**
     * This method will show modal popup to disply error received from http calls
     */
    showModal = (message, headerText) => {
        setTimeout(() => {
            this.dialogService.showDialog(headerText, "fa fa-exclamation circle-red", "", "", message,
                "", () => { }, "Ok", () => { });
        }, 500);
    }
    private is2xxStatus(response: HttpResponseBase) {
        return response.status >= 200 && response.status < 300 && response.statusText === 'OK';
    }
}