import { Injectable } from '@angular/core';

@Injectable()
export class CurrentRoomService {

  constructor() { }

  room = {
    name: null,
    areaId: null,
    id: null,
    description: null,
    exits: null
  }

}
