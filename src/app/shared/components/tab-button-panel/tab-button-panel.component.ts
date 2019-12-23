import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-button-panel',
  templateUrl: './tab-button-panel.component.html',
  styleUrls: ['./tab-button-panel.component.scss']
})
export class TabButtonPanelComponent implements OnInit {
  @Input() buttonItems: any = [];
  public selectedItem: any;
  public locationPath: any;

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {
    this.defaultData();

    // On url change call function
    this.router.events.subscribe((event) => {
      this.defaultData();
    });
  }

  /**
   * defaultData
   */
  public defaultData = () => {
    let locationStr = window.location.href;
    this.locationPath = locationStr.split("?")[0];
    this.buttonItems.forEach(element => {
      if ((this.locationPath.split("/")[(this.locationPath.split("/").length) - 1]) === (element.text.split(" ").join("-").toLowerCase())) {
        this.selectedItem = element;
      } else {
        this.selectedItem = this.buttonItems[0];
      }
    });
  }
  /**
   * listClick
   */
  listClick(event, newValue) {
    this.selectedItem = newValue;
  }

  public isHidden = (btn: any) => {
    return btn.hideTab ? btn.hideTab == 'Y' ? false : true : true;
  }
}
