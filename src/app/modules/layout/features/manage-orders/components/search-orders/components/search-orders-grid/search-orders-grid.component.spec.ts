import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOrdersGridComponent } from './search-orders-grid.component';

describe('SearchOrdersGridComponent', () => {
  let component: SearchOrdersGridComponent;
  let fixture: ComponentFixture<SearchOrdersGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchOrdersGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOrdersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
