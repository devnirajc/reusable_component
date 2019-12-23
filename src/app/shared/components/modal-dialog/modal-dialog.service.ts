import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from './modal-dialog.component';
import { Injectable, TemplateRef } from '@angular/core';

@Injectable()
export class DialogService {
  constructor(private modalService: BsModalService) { }
  public bsModalRef: any;

  showDialog(headerTitle: any, iconClass: string, template: any, data: any, message: any, successButtonText: string, successCallback: Function, cancelButtonText: string, cancelCallBack: Function) {
    let thisModalNumber = this.modalService.getModalsCount();
    if (thisModalNumber < 1) {
    this.bsModalRef = this.modalService.show(ModalDialogComponent, { animated: true, keyboard: false, backdrop: true, ignoreBackdropClick: true });
      this.bsModalRef.content.headerTitle = headerTitle;
      this.bsModalRef.content.iconClass = iconClass;
      this.bsModalRef.content.template = template;
      this.bsModalRef.content.successButtonText = successButtonText;
      this.bsModalRef.content.data = data;
      this.bsModalRef.content.message = message;
      this.bsModalRef.content.onSuccess = () => {
        this.hidePopup();
        successCallback();
      }
      this.bsModalRef.content.cancelButtonText = cancelButtonText;
      this.bsModalRef.content.onCancel = () => {
        this.hidePopup();
      }
    }
  }


  /**
   * hidePopup 
   */
  public hidePopup = () => {
    this.bsModalRef.hide()
  }
}