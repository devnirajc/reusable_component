import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUpdateComponent } from './header-update.component';

describe('HeaderUpdateComponent', () => {
  let component: HeaderUpdateComponent;
  let fixture: ComponentFixture<HeaderUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
