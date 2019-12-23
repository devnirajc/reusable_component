import { SidebarService } from '@app/shared/services';
import { Component, OnInit, HostListener } from '@angular/core';
import * as $ from 'jquery';
import { Location } from '@angular/common';
import { SideBarConfig } from '@app/shared/config';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarData: any;
  public selectedItem: any;
  public locationPath: any;
  public href: any;
  public counter: number = 0;
  constructor(private translate: TranslateService, private location: Location, private router: Router, private _sidebarService: SidebarService) { }
  ngOnInit() {
    this.populateSidebarBasedOnPermissions();
    this.defaultData();
    // On url change call function
    this.router.events.subscribe((event) => {
      this.defaultData();
    });
    if (window.innerWidth > 767) {
      this.sidebarOpen();
    }
  }
  /**
   * populateSidebarBasedOnPermissions this will push all the sidebar data which has permissions
   */
  private populateSidebarBasedOnPermissions = () => {
    let _sidebarData: any = SideBarConfig;
    this._sidebarService.SidebarData = [];
    _sidebarData.forEach(element => {
      let result = true;
      if(element.categoryId)
      {
        result = true;
      }
      result ? this._sidebarService.SidebarData.push(this.populateSidebarChildBasedOnPermissions(element)) : '';
    });
    this.sidebarData = this._sidebarService.SidebarData;
    this.sidebarDefaultConfig();
  }
  /**
   * Side bar default data setting and home url setting
   */
  public sidebarDefaultConfig = () => {
    this._sidebarService.setHomeUrl();
    let url: String = this.sidebarData.length > 0 ? this._sidebarService.HomeUrl : 'non-authorized';
    (this.router.url == '/' || this.router.url == '/non-authorized') ? this.router.navigate([url]) : '';
  }
  /**
   * populateSidebarChildBasedOnPermissions this function will perform the whther the sub elements  has permission can view
   */
  public populateSidebarChildBasedOnPermissions = (el: any) => {
    let result: any;
    if (el.sub == null) {
      return el;
    }
    result = Object.assign({}, el);
    result.sub = [];
    el.sub.forEach(element => {
      let subElPermisson: boolean = true;
      if(element.capabilityId){
        element.capabilityId.forEach(subEl => {
          subElPermisson = true;
        });
      }    
      subElPermisson ? result.sub.push(element) : '';
    });
    result.sub = result.sub.length > 0 ? result.sub : null;
    return result;
  }
  /**
   * defaultData
   */
  public defaultData = () => {
    this.counter++;
    let locationStr = window.location.href;
    this.locationPath = locationStr.split("?")[0];
    this.sidebarData.forEach((element, index) => {
      this.sidebarData[index].name = this.translate.instant(element.name);
      if ((this.locationPath.split("/").pop()) === (element.link && element.link.split("/").pop())) {
        this.selectedItem = element;
      } else if (element.sub) {
        (element.sub).forEach((subElement, subIndex) => {
          this.sidebarData[index].sub[subIndex].name = this.translate.instant(subElement.name);
          if (this.locationPath.split('#')[1] === subElement.link) {
            this.selectedItem = subElement;
            setTimeout(() => {
              $(".show").removeClass("show").parent().find("a[data-toggle*='collapse']").attr("aria-expanded", "false");
              $("a[href$='#" + index + "']").attr("aria-expanded", "true");
              $("#" + index).parent().find("ul").addClass("show");
            }, 500);
          }
        });
      }
    });
  }
  /**
   * menuClick
   */
  menuClick(newValue) {
    if (!newValue.sub) {
      this.selectedItem = "";
      this.selectedItem = newValue;
      // If Tab or mobile Hide sidebar on any selection
      if (window.innerWidth < 767) {
        this.sidebarOpen();
      }
    }
  }
  /**
   * sidebarOpen  
   */
  public sidebarOpen = () => {
    $('#sidebar').toggleClass('active');
    $('#sidebar .triangle').toggleClass('active1');
  }
}