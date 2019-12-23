import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuardService as AuthGuard } from '@app/core/services';
import { LayoutGuard } from './layout.guard';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  canActivate: [LayoutGuard],
  children: [
    {
      path: ''
    }, {
      path: 'manage-order',
      loadChildren: './features/manage-orders/manage-orders.module#ManageOrdersModule'
    }, {
      path: 'create-order',
      loadChildren: './features/create-orders/create-orders.module#CreateOrdersModule'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
