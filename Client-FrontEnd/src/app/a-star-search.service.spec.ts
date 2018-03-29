import { TestBed, inject } from '@angular/core/testing';

import { AStarSearchService } from './a-star-search.service';

describe('AStarSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AStarSearchService]
    });
  });

  it('should be created', inject([AStarSearchService], (service: AStarSearchService) => {
    expect(service).toBeTruthy();
  }));
});
