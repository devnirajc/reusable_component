import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() fileDropContainer: string;
  @Input() fileUploadId: string = '';
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Output() InputChange = new EventEmitter<any>();
  @Input() resetFilesData: boolean = false;
  @ViewChild('file') file = null;
  public files: Set<File> = new Set();
  constructor() { }

  ngOnInit() {
  }
  public onFilesAdded = () => {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    this.InputChange.emit(files);
  }

  public resetFiles = () => {
    (this.resetFilesData) ? this.file.nativeElement.value = '' : this.onFilesAdded();
  }
}
