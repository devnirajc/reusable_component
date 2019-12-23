import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerComponent } from './datepicker.component';

import { BsDatepickerModule } from 'ngx-bootstrap';
import * as moment from 'moment';
describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BsDatepickerModule.forRoot()],
      declarations: [DatepickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the datepickercomponent', () => {
    component.ngOnInit();
    expect(component.placeholder).toBe('Select Date');
  });
  it('should trigger isChecked event', () => {
    component.change.subscribe(a => {
      expect(a).toBeTruthy();
    });
    component.onValueChange(new Date());
  });
  it('should set date Value', () => {
    component.showDefaultDate = true;
    component.value = "07/11/2018";
    component.dateValue();
    expect(moment(component.defaultDate).format('MM/DD/YYYY')).toBe("07/11/2018");
  });
});
