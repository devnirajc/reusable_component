import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabButtonPanelComponent } from './tab-button-panel.component';

describe('TabButtonPanelComponent', () => {
  let component: TabButtonPanelComponent;
  let fixture: ComponentFixture<TabButtonPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabButtonPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabButtonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should handle event on button click', () => {
    component.listClick(event, 'inbox');
    expect(component.selectedItem).toMatch('inbox');
  });
});
