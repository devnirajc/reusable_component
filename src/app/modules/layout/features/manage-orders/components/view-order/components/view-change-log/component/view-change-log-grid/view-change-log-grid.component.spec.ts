import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChangeLogGridComponent } from './view-change-log-grid.component';

describe('ViewChangeLogGridComponent', () => {
  let component: ViewChangeLogGridComponent;
  let fixture: ComponentFixture<ViewChangeLogGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChangeLogGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChangeLogGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
