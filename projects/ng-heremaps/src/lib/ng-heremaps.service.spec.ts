import { TestBed, inject } from '@angular/core/testing';

import { NgHeremapsService } from './ng-heremaps.service';

describe('NgHeremapsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgHeremapsService]
    });
  });

  it('should be created', inject([NgHeremapsService], (service: NgHeremapsService) => {
    expect(service).toBeTruthy();
  }));
});
