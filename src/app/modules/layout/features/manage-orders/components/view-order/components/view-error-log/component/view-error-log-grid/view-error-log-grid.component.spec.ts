import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewErrorLogGridComponent } from './view-error-log-grid.component';

describe('ViewErrorLogGridComponent', () => {
  let component: ViewErrorLogGridComponent;
  let fixture: ComponentFixture<ViewErrorLogGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewErrorLogGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewErrorLogGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
