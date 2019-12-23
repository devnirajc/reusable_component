import { Component, OnInit, Input, ContentChild ,TemplateRef} from '@angular/core';
import { ModalService } from './modal.service';
declare var $ : any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  @ContentChild('modalHeader') modalHeader: TemplateRef<any>;
  @ContentChild('modalBody') modalBody: TemplateRef<any>;
  @ContentChild('modalFooter') modalFooter: TemplateRef<any>;

  @Input('size') size : string = 'modal-md';
  @Input('centered') centered : boolean = true;
  @Input('ref') ref : string;
  @Input('backdrop') backdrop : boolean = false;
  @Input('keyboard') keyboard : boolean = false;
  @Input('show') show : boolean = true;
  
  constructor(private modalService : ModalService) {
    $('#'+this.ref).modal({
      backdrop: this.backdrop,
      keyboard: this.keyboard,
      show : this.show
    })
   }

  ngOnInit() {
    
  }

   /** Close Modal Popup */
   public closeModal = () => {
    this.modalService.closeModal(this.ref);
  }

  ngOnDestroy(){
    this.modalService.setInitialize(true);
  }
}