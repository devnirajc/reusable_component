import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { CreateOrdersRoutingModule } from './create-orders-routing.module';
import { SharedModule } from '@app/shared';
import {
  SingleOrderComponent,
  BulkOrderComponent,
  BulkOrderInboxComponent,
  SingleOrderGridComponent,
  SingleOrderFormComponent,
  BulkOrderUploadComponent,
  BulkOrderInboxSearchComponent
} from './components';
import { SingleOrderService } from "./components/single-order/single-order.service";
import { DragDropComponent, FileUploadComponent } from "@app/shared/components";
export class CustomOption extends ToastOptions {
  positionClass = 'screen-center'
}


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CreateOrdersRoutingModule,
    ToastModule.forRoot()
  ],
  declarations: [
    SingleOrderComponent,
    BulkOrderComponent,
    BulkOrderUploadComponent,
    BulkOrderInboxComponent,
    SingleOrderGridComponent,
    SingleOrderFormComponent,
    DragDropComponent,
    FileUploadComponent,
    BulkOrderInboxSearchComponent
  ],
  providers: [{ provide: ToastOptions, useClass: CustomOption }, SingleOrderService]
})
export class CreateOrdersModule { }
