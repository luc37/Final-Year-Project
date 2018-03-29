import { Injectable } from '@angular/core';

@Injectable()
export class SignInService {

  constructor() { }

  character = {
    name: null,
    id: null,
    commandList: null,
    socketId: null,
    isChar: null,
    roomId: null,
    lookDirecion: null,
    smell: null,
    sound: null,
    health: null,
    bullets: null,
    gunPower: null,
    reload: null
  }


}
