import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOrderGridComponent } from './single-order-grid.component';

describe('SingleOrderGridComponent', () => {
  let component: SingleOrderGridComponent;
  let fixture: ComponentFixture<SingleOrderGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleOrderGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOrderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
