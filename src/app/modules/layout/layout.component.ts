import { TokenService } from './../../core/services/jwt/token.service';
import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@app/shared/services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private orderService: OrdersService) { }

  ngOnInit() {
  }
 
}
