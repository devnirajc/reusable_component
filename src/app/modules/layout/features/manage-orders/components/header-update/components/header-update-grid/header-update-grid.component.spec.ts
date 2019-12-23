import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUpdateGridComponent } from './header-update-grid.component';

describe('HeaderUpdateGridComponent', () => {
  let component: HeaderUpdateGridComponent;
  let fixture: ComponentFixture<HeaderUpdateGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderUpdateGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderUpdateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
