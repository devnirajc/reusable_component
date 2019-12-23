import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '@app/shared/index';
import { LayoutComponent } from './layout.component';
import { LayoutGuard } from './layout.guard';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ],
  declarations: [
    LayoutComponent
  ],
  exports: [
  ],
  providers: [
    LayoutGuard
  ]
})
export class LayoutModule { }
