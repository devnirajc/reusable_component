import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChangeLogComponent } from './view-change-log.component';

describe('ViewChangeLogComponent', () => {
  let component: ViewChangeLogComponent;
  let fixture: ComponentFixture<ViewChangeLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChangeLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
