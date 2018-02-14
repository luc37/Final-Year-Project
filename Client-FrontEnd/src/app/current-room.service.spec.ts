import { TestBed, inject } from '@angular/core/testing';

import { CurrentRoomService } from './current-room.service';

describe('CurrentRoomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentRoomService]
    });
  });

  it('should be created', inject([CurrentRoomService], (service: CurrentRoomService) => {
    expect(service).toBeTruthy();
  }));
});
