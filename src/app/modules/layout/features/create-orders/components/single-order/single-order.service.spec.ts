import { TestBed, inject } from '@angular/core/testing';

import { SingleOrderService } from './single-order.service';

describe('SingleOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SingleOrderService]
    });
  });

  // it('should be created', inject([SingleOrderService], (service: SingleOrderService) => {
  //   expect(service).toBeTruthy();
  // }));
});
