import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOrderInboxComponent } from './bulk-order-inbox.component';

describe('BulkOrderInboxComponent', () => {
  let component: BulkOrderInboxComponent;
  let fixture: ComponentFixture<BulkOrderInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkOrderInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOrderInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
