import { Component, OnInit, Input, TemplateRef, ContentChild, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  @Input() cardDetail: Object;
  @Input() cls: string;
  @Input() isCheckBoxtoChild: boolean;
  @Input() selectionType: string = 'checkbox';
  @Output() cardIsSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() recordSelected = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  /**
   * selected
   */
  public selected = (item: any) => {
    this.recordSelected.emit(item);
  }

}
