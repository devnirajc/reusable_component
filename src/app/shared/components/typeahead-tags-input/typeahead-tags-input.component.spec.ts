import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadTagsInputComponent } from './typeahead-tags-input.component';

describe('TypeaheadTagsInputComponent', () => {
  let component: TypeaheadTagsInputComponent;
  let fixture: ComponentFixture<TypeaheadTagsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeaheadTagsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeaheadTagsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
