import { Injectable } from '@angular/core';

@Injectable()
export class CurrentRoomService {

  constructor() { }

  room = {
    name: null,
    areaId: null,
    id: null,
    description: null,
    exits: null,
    position: null,
    northBoundary: null,
    eastBoundary: null,
    southBoundary: null,
    westBoundary: null,
    circuit: null,
    lit: null,
    objects: null,
    lights: null
  }

}
