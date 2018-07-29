import { TestBed, inject } from '@angular/core/testing';

import { HereMapsServiceService } from './here-maps-service.service';

describe('HereMapsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HereMapsServiceService]
    });
  });

  it('should be created', inject([HereMapsServiceService], (service: HereMapsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
