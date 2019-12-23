import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { FormFieldConfig } from "@app/shared/model";
import { Validators, FormGroup } from "@angular/forms";
import { StaticText } from "@app/shared/constants";
import { MessagesService, OrdersService, RouterService, ManageUserService, UtilsService } from "@app/shared/services";
import { LoaderService, JwtService } from "@app/core/services";
import { DialogService } from "@app/shared/components";
import { TranslateService } from "@ngx-translate/core";
import { saveAs } from 'file-saver';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-bulk-order-upload',
  templateUrl: './bulk-order-upload.component.html',
  styleUrls: ['./bulk-order-upload.component.scss']
})
export class BulkOrderUploadComponent implements OnInit {

  constructor(private utill: UtilsService, private translate: TranslateService, private dialogService: DialogService, private routerService: RouterService, 
    private msgService: MessagesService, private orderService: OrdersService, private loaderService: LoaderService, public toastr: ToastsManager, vcr: ViewContainerRef,
    private jwtService : JwtService, private manageUserService : ManageUserService) {  this.toastr.setRootViewContainerRef(vcr); }

  @Input() form: FormGroup;
  @Input() dragDropCls: string;
  @Input() fileDropContainer: any;
  @Output() fetchForm = new EventEmitter<any>();
  @Output() redirectToInbox = new EventEmitter();
  public formFields: any;
  public data: any = [];
  public fileName: any;
  public hideUploadButton: boolean = true;
  public isValidFileExtension: boolean = false;
  public fileInfo: any;
  public resetBtnText: string = this.translate.instant('reset');
  public cancelBtnClass: string = 'btn btn-default';
  public submitText: string = this.translate.instant('uploadBtnText');
  public submitBtnClass: string = 'btn btn-success';
  public downloadTemplate = this.translate.instant('downloadTemplate');
  public dragAndDrop = this.translate.instant('dragAndDrop');
  public invalidFileFormat = this.translate.instant('invalidFileFormat');
  public permissions: any;
  public resetFilesData: boolean = false;
  private _user = this.jwtService.getLdapID();
  private _emailId : any;

  ngOnInit() { 
    // this.manageUserService.getLoggedInUserEmail(this._user).then((data) => {
      this.initializeForm();
    // });
  }

  /**
   * onSubmit
   */
  public submitForm = () => {
    let requestData: any = {};
    requestData = JSON.parse(JSON.stringify(this.form.getRawValue()));
    let formValues: any = new FormData();   
    this.prepareValues(formValues , requestData);
    this.orderService.uploadBulkOrder(formValues)
      .subscribe(data => {       
        this.isValidFileExtension = false;
        this.hideUploadButton = true;
        this.resetForm();
        this.loaderService.hide();
        this.showSuccess();
      });
  }

   /*
 * toaster message for file upload
 * */
 public showSuccess = () => {
  this.toastr.success('File Upload Successful')
        .then((toast: any) => {
            setTimeout(() => {
                this.toastr.dismissToast(toast);
                this.routerService.navigateTo('/create-order/bulk-order/inbox');
            }, 2000);
    });
}

  public prepareValues = (formValues : any , data:any) => {
    formValues.append('email', data.emailId);
    formValues.append('userId', data.userId);
    formValues.append('comment', data.comments);
    formValues.append('file', this.fileInfo[0]);
  }


  /** To reset the form  */
  resetForm = () => {
    this.fileName = '';
    this.resetFilesData = true;
    this.isValidFileExtension = false;
    this.hideUploadButton = true;
    this.form.reset();
    this.form.patchValue({ userId: this._user });
  }

  public fetchText() {
    return this.translate.instant('nonAuthorizedText');
  }

  /** Initialize form */
  public initializeForm = () => {
    this.formFields = [
      new FormFieldConfig({
        type: 'textarea', subtype: 'text', label: this.translate.instant('comments'), fieldWidthCls: 'col-md-12', fieldWidth: 'col-md-8', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-3 col-form-label', inputClass: "form-control form-control-sm", formName: 'comments',
        keyDown: (e: KeyboardEvent, item: any, index: number) => {
          if (this.utill.regexForHypenCommaSpaceFullstopAndAlphnumeric(e.key)) {
            return;
          }
          else
            e.preventDefault();
        },
        paste: (e: any) => {
          let val: string = e.clipboardData.getData('text/plain');
          if (this.utill.regexForHypenCommaSpaceFullstopAndAlphnumeric(val))
            return;
          else
            e.preventDefault();
        },
        maxlength: 60,

      }),
      new FormFieldConfig({
        type: 'input', formName: 'emailId', label: this.translate.instant('emailId'),
        fieldWidthCls: 'col-md-12', displayLabelCls: 'form-group required row',
        fieldLabelClass: 'col-md-3 col-form-label', fieldWidth: "col-md-8", inputClass: "form-control form-control-sm",
        validation: [Validators.required, Validators.email], renderLabel: (item) => {
          return this.renderLabel(item, true);
        }, blur: (e: any, item: any) => {
        }, errorMessages: true, isErrorMessageVisible: (item: any) => {
          return this.basicFieldValidation(item);
        }, displayErrorMessage: (item: any) => {
          return this.displayFormErrorMsg(item);
        },
        value : this.manageUserService.loggedInUserEmail ? this.manageUserService.loggedInUserEmail : ''
      }),
      new FormFieldConfig({ type: 'input', formName: 'userId', value: this._user, readOnly: () => { return true; }, label: this.translate.instant('userId'), fieldWidthCls: 'col-md-12', displayLabelCls: 'form-group required row', fieldLabelClass: 'col-md-3 col-form-label', fieldWidth: "col-md-8", inputClass: "form-control form-control-sm" }),
    ]
  }


  /**
    * basicFieldValidation
    */
  public basicFieldValidation = (item: any): boolean => {
    return this.form && !this.form.get(item.formName).valid && this.form.get(item.formName).touched;
  }
  /**
   * displayFormErrorMsg
   */
  public displayFormErrorMsg = (cfg: any) => {
    let key = cfg.formName;
    let errorType = this.form && this.form.get(cfg.formName).errors ? Array.isArray(this.form.get(cfg.formName).errors) ? Object.keys(this.form.get(cfg.formName).errors)[0] : Object.keys(this.form.get(cfg.formName).errors)[0] : '';
    return this.msgService.fetchMessage(key, errorType);
  }


  public renderLabel = (cfg, required) => {
    return cfg && cfg.label && required ? `${cfg.label}<sup class="text-danger">*</sup>` : (cfg && cfg.label) ? cfg.label : '';
  }

  public isDisabled = (): boolean => {
    return this.form && !this.form.valid;
  }

  /**
   * onSubmit
   */
  public onSubmit = (e) => {
    this.isDisabled() || this.hideUploadButton ? this.markFormGroupTouched(this.form) : this.submitForm();
  }

  /**
  * Marks all controls in a form group as touched
  * @param formGroup - The group to caress..hah
  */
  private markFormGroupTouched(formGroup: FormGroup) {
    this.isValidFileExtension = (this.fileName && this.fileName != '') ? false : true;
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  public onDrop = (eventFileInfo: any) => {
    this.fileName = eventFileInfo.dataTransfer.files[0].name;
    this.fileInfo = eventFileInfo.dataTransfer.files;
    this.checkIsFileValid();
  }

  public checkIsFileValid = () => {
    var extensionArray = ['txt', 'tsv'];
    let fileExtension = this.fileName.replace(/^.*\./, '');
    this.hideUploadButton = false;
    if (!extensionArray.includes(fileExtension)) {
      this.fileName = '';
      this.isValidFileExtension = true;
      this.hideUploadButton = true;
      return false;
    } else {
      this.isValidFileExtension = false;
      this.hideUploadButton = false;
      return true;
    }
  }

  public InputChange = (e: any) => {
    if (e.length > 0) {
      this.fileName = e[0].name;
      this.fileInfo = e;
      this.checkIsFileValid();
    } else {
      this.fileName = '';
      this.fileInfo = e;
    }
  }
  /**
   * fetchBulkOrderForm
   */
  public fetchBulkOrderForm = (form: any) => {
    this.form = form;
    // this.form.controls.userId.patchValue(this._user);
    // this.form.controls.emailId.patchValue(this.manageUserService.loggedInUserEmail);
  }

  exportPdf() {
    this.orderService.export().subscribe(data => { this.loaderService.hide(); saveAs(data, `bulk_upload_template_v3.txt`) });
  }
}
