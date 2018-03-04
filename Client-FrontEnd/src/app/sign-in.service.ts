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
    roomId: null
  }


}
