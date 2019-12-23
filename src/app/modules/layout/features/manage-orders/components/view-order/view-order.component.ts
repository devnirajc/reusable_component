import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})

export class ViewOrderComponent implements OnInit {

  public viewOrder: string = this.translate.instant('viewOrder');
  public errorLog: string = this.translate.instant('errorLog');
  public changeLog: string = this.translate.instant('changeLog');
  constructor(private translate : TranslateService) { }

  ngOnInit() {
  }

}
