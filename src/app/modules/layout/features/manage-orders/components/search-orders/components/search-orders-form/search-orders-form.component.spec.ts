import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOrdersFormComponent } from './search-orders-form.component';

describe('SearchOrdersFormComponent', () => {
  let component: SearchOrdersFormComponent;
  let fixture: ComponentFixture<SearchOrdersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchOrdersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOrdersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
