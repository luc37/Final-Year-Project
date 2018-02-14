import { Injectable } from '@angular/core';

@Injectable()
export class SignInService {

  constructor() { }

  character = {
    characterName: null,
    characterId: null,
    commands: null,
    socketId: null,
    isChar: null,
    roomId: null
  }


}
