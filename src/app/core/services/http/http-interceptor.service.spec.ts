import { TestBed, inject } from '@angular/core/testing';

import { HttpInterceptorsService } from './http-interceptor.service';
import { LoaderService } from '@app/core/services';
import { DialogService } from "@app/shared/components/modal-dialog/modal-dialog.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from "ngx-bootstrap";
describe('HttpInterceptorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      providers: [HttpInterceptorsService, LoaderService, DialogService, BsModalService]
    });
  });

  // it('should be created', inject([HttpInterceptorsService], (service: HttpInterceptorsService) => {
  //   expect(service).toBeTruthy();
  // }));
});
