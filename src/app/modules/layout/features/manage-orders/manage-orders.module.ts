import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageOrdersRoutingModule } from './manage-orders-routing.module';
import { SharedModule } from '@app/shared/index';
import {
  SearchOrdersComponent,
  HeaderUpdateComponent,
  EditOrderComponent,
  ViewOrderComponent,
  SearchOrdersGridComponent,
  ViewOrderDetailsComponent,
  ViewErrorLogComponent,
  ViewChangeLogComponent,
  HeaderUpdateGridComponent,
  SearchOrdersFormComponent,
  ViewErrorLogGridComponent,
  ViewChangeLogGridComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ManageOrdersRoutingModule,
    SharedModule
  ],
  declarations: [SearchOrdersComponent, HeaderUpdateComponent, EditOrderComponent, ViewOrderComponent, SearchOrdersGridComponent, ViewOrderDetailsComponent, ViewErrorLogComponent, ViewChangeLogComponent, HeaderUpdateGridComponent, SearchOrdersFormComponent, ViewErrorLogGridComponent, ViewChangeLogGridComponent]
})
export class ManageOrdersModule { }
