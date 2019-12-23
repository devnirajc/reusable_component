import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

  @Input() iconClass: string;
  @Input() headerTitle: string;
  @Input() data: any;
  @Input() template: TemplateRef<any>;
  @Input() cancelButtonText: string;
  @Input() message: string;
  @Input() successButtonText: string;
  @Input() errorButtonText: string;
  @Output() onSuccessBtnClick  = new EventEmitter<any>(); 

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService) { }

  ngOnInit() { }

}
