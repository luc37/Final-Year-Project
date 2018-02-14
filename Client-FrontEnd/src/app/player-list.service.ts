import { Injectable } from '@angular/core';
import { SignInService }  from './sign-in.service';

@Injectable()
export class PlayerListService {

  constructor(private signInService:SignInService) {}

  playerList;
  playersInRoomList;

  updateRoomList(): void{
    const ctrl = this;

    this.playersInRoomList = [];   

    this.playerList.forEach(character => {

      if(character.roomId === ctrl.signInService.character.roomId){
        ctrl.playersInRoomList.push(character);
      }
    });
  }

}
