import { TokenService } from '../../core/services/jwt/token.service';
import { AppConfigService } from '@app/core/services/config';
import { JwtService } from '../../core/services/jwt/jwt.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LayoutGuard implements CanActivate {
 constructor(private jwtService: JwtService, private AppConfiguration: AppConfigService,
  private tokenService: TokenService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  navigateToSSOUrl = () => {
    window.location.href = this.AppConfiguration.appConfig.loginBaseUrl;
    return false;
  }

  populateJwtToken = () => {
    let redirect : boolean =  false;
  }
}
