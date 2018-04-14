import { Injectable } from '@angular/core';
import { SignInService }  from './sign-in.service';

@Injectable()
export class PlayerListService {

  constructor(private signInService:SignInService) {}

  playerList = [];
  playersInRoomList = [];
  allCharactersList = [];

  setLists(list): void{
    const ctrl = this;

    this.playerList = [];
    this.allCharactersList = list;

    list.forEach(character => {
      if(character.id < 999){
        ctrl.playerList.push(character);
      }
    });

    this.allCharactersList.forEach(function(character){
      if(character.id === ctrl.signInService.character.id){
        ctrl.signInService.character.hiding = character.hiding;
      }
    });
  }

  updateRoomList(): void{
    const ctrl = this;

    this.playersInRoomList = [];   

    this.allCharactersList.forEach(character => {

      if(character.roomId === ctrl.signInService.character.roomId){
        if(character.hiding === false || character.id === ctrl.signInService.character.id ){
          ctrl.playersInRoomList.push(character);
        }
      }
    });
  }

}
