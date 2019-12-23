import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimepickerwrapperComponent } from './datetimepickerwrapper.component';

describe('DatetimepickerwrapperComponent', () => {
  let component: DatetimepickerwrapperComponent;
  let fixture: ComponentFixture<DatetimepickerwrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatetimepickerwrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimepickerwrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
