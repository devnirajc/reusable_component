import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOrderFormComponent } from './single-order-form.component';

describe('SingleOrderFormComponent', () => {
  let component: SingleOrderFormComponent;
  let fixture: ComponentFixture<SingleOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleOrderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
