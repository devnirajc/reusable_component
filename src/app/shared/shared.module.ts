import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TabComponent } from './components/tabs/tab.component';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { TypeaheadModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import {
  HeaderComponent,
  SidebarComponent,
  ButtonComponent,
  PaginationComponent,
  GridComponent,
  DropDownComponent,
  TabsComponent,
  ModalDialogComponent,
  CardsComponent,
  DatepickerComponent,
  FormComponent,
  DialogService,
  SearchPanelComponent,
  PanelComponent,
  TabButtonPanelComponent,
  ModalComponent,
  ModalService,
  RadioWithAnyInputComponent,
  DualListComponent,
  ToggleSwitchComponent,
  RangeSliderComponent,
  CheckboxComponent,
  SchedulerComponent,
  EditableGridComponent,
  DatetimepickerwrapperComponent,
  TypeaheadTagsInputComponent,
  TagsInputComponent, 
  MultiCheckboxComponent
} from './components/index';
import {
  OrdersService,
  MessagesService,
  RouterService,
  SearchService,
  ManageUserService,
  UtilsService,
  SidebarService,
  ToasterService,
} from './services';

import { RouterModule } from '@angular/router';
import { HttpInterceptorsService } from "@app/core/services";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonDirective, ValidateInputDirective, StickyHeaderDirective, InfiniteScrollDirective , BlockCopyPasteDirective, DomChangeDirective} from './directive/index';
import { customGlobalValidation } from '@app/shared/globalValidations/global-custom.validators';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    PerfectScrollbarModule,
    TypeaheadModule.forRoot(),
    TimepickerModule.forRoot(),
    NgbModule.forRoot()
  ],
  exports: [
    HeaderComponent,
    GridComponent,
    SidebarComponent,
    DropDownComponent,
    TabsComponent,
    TabComponent,
    ButtonComponent,
    DatepickerComponent,
    FormComponent,
    CardsComponent,
    HttpClientModule,
    SearchPanelComponent,
    HttpClientModule,
    ModalDialogComponent,
    PanelComponent,
    TabButtonPanelComponent,
    PaginationComponent,
    DualListComponent,
    RangeSliderComponent,
    CommonDirective,
    ValidateInputDirective,
    ModalComponent,
    RadioWithAnyInputComponent,
    ToggleSwitchComponent,
    FormsModule,
    ReactiveFormsModule,
    CheckboxComponent,
    SchedulerComponent,
    EditableGridComponent,
    DatetimepickerwrapperComponent,
    TypeaheadTagsInputComponent,
    MultiCheckboxComponent,
    StickyHeaderDirective,
    InfiniteScrollDirective,
    BlockCopyPasteDirective,
    DomChangeDirective
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ButtonComponent,
    PaginationComponent,
    GridComponent,
    DropDownComponent,
    TabsComponent,
    ModalDialogComponent,
    DatepickerComponent,
    CardsComponent,
    TabComponent,
    FormComponent,
    SearchPanelComponent,
    PanelComponent,
    TabButtonPanelComponent,
    RangeSliderComponent,
    CommonDirective,
    ValidateInputDirective,
    ModalComponent,
    RadioWithAnyInputComponent,
    DualListComponent,
    ToggleSwitchComponent,
    CheckboxComponent,
    SchedulerComponent,
    EditableGridComponent,
    DatetimepickerwrapperComponent,
    TypeaheadTagsInputComponent,
    TagsInputComponent,
    MultiCheckboxComponent,
    StickyHeaderDirective,
    InfiniteScrollDirective,
    BlockCopyPasteDirective,
    DomChangeDirective
  ],
  entryComponents: [ModalDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorsService,
      multi: true,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useClass: HttpInterceptorsService,
      multi: true,
    },
    OrdersService,
    MessagesService,
    BsModalService,
    DialogService,
    RouterService,
    SearchService,
    ModalService,
    ManageUserService,
    customGlobalValidation,
    UtilsService,
    SidebarService,
    ToasterService,
    TitleCasePipe
  ]
})
export class SharedModule { }
