import { TestBed, inject, fakeAsync } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
//const envConfig = require('/assets/json/env-config.json');
describe('AppConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfigService, HttpClient, HttpHandler]
    });
  });
});
