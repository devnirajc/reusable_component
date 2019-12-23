import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ToasterService {

  constructor(public toastr: ToastsManager) { }

  showSuccess(msg: string, title: any, life: number) {
    this.toastr.success(msg, title, { toastLife: life });
  }

  showError(msg: string, title: any, dismiss: string, showCloseBtn: boolean, life: number) {
    this.toastr.error(msg, title, { dismiss: dismiss, showCloseButton: showCloseBtn, toastLife: life });
  }

  showWarning(msg: string, title: any, life: number) {
    this.toastr.warning(msg, title, { toastLife: life });
  }

  showInfo(msg: string, title: any, life: number) {
    this.toastr.info(msg, title, { toastLife: life });
  }
}
