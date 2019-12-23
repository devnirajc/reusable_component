import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewErrorLogComponent } from './view-error-log.component';

describe('ViewErrorLogComponent', () => {
  let component: ViewErrorLogComponent;
  let fixture: ComponentFixture<ViewErrorLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewErrorLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewErrorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
