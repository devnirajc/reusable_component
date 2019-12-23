import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import {LoaderService} from '@app/core/services';
describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderComponent ],
      providers : [LoaderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show loader', inject([LoaderService], (service: LoaderService) => {
    service.show();
    expect(component.show).toBe(true);
  }));
  it('should hide loader', inject([LoaderService], (service: LoaderService) => {
    service.hide();
    expect(component.show).toBe(false);
  }));
});
