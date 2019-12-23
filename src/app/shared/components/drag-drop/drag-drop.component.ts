import { Component, OnInit, HostListener, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit {
  @Input() dragDropCls: string;
  @ViewChild('files') files: ElementRef;
  @Output() dragOver = new EventEmitter<any>();
  @Output() dragLeave = new EventEmitter<any>();
  @Output() drop = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  @HostListener('drop', ['$event'])

  /**
   * 
   */
  public onDrop = (e: any) => {
    e.preventDefault();
    this.drop.emit(e);
  }

  @HostListener('dragover', ['$event'])
  /**
   * onDragOver
   */
  public onDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragOver.emit(e);
  }

  @HostListener('dragleave', ['$event'])
  /**
   * onDragLeave
   */
  public onDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragLeave.emit(e);
  }
}
