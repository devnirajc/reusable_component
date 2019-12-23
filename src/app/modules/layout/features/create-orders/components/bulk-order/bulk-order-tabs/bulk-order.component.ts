import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { MessagesService, RouterService } from "@app/shared/services";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-bulk-order',
  templateUrl: './bulk-order.component.html',
  styleUrls: ['./bulk-order.component.scss']
})

export class BulkOrderComponent implements OnInit {
  @ViewChild('inbox') fileInput:ElementRef;
  constructor(private translate : TranslateService, private msgService: MessagesService,private routerService : RouterService) { }
  public bulkOrder: any = this.translate.instant('bulkOrder');
  public inBox: any = this.translate.instant('inbox');
  public buttonItems : any = [];
  public permissions : any = [];

  ngOnInit() {
    this.configureButtonItems();
  }
  /**
   * configureButtonItems
   */
  public configureButtonItems = () => {
    this.buttonItems = [{
      click : (cfg: any) => {
        this.navigateTo('/create-order/bulk-order');
      },
      class : '',
      text : this.bulkOrder
      
    },{
       click : (cfg: any) => {
        this.navigateTo('/create-order/bulk-order/inbox');
      },
      class : '',
      text : this.inBox
    }];
  }
  public setActiveInactive = () =>{ 
     
  }
  /**
   * navigateTo
   */
  public navigateTo = (url) => {
    this.routerService.navigateTo(url);
  }
}
