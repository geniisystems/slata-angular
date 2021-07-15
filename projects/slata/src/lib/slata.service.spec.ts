import { TestBed } from '@angular/core/testing';

import { SlataService } from './slata.service';

describe('SlataService', () => {
  let service: SlataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
