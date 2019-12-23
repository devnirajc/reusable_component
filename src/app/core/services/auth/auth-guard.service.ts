import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from "@app/shared/components/modal-dialog/modal-dialog.service";
@Injectable()
export class AuthGuardService {
  private _result: Observable<boolean>;
  constructor(public router: Router, private dialogService: DialogService) { }
}
