import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService as AuthGuard} from '@app/core/services';
import {
  SingleOrderComponent,
  BulkOrderComponent,
  BulkOrderInboxComponent,
  BulkOrderUploadComponent
} from './components';

const routes: Routes = [{
  path: 'single-order',
  component: SingleOrderComponent
}, {
  path: 'bulk-order',
  component: BulkOrderComponent,
  children: [{
    path: '',
    component: BulkOrderUploadComponent
  }, {
    path: 'inbox',
    component: BulkOrderInboxComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateOrdersRoutingModule { }
