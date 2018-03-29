import { Component, OnInit, Input } from '@angular/core';
import { SignInService } from '../../../sign-in.service';
import { PlayerListService } from '../../../player-list.service';
import { CurrentRoomService } from '../../../current-room.service';

@Component({
  selector: 'game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.less']
})
export class GameDetailsComponent implements OnInit {
  connectionCount;
  playerList;

  @Input() socket;
  @Input() characterName;
    
  roomList;
  playerCount;

  roomName;
  roomDescription;

  showPlayerList;
  showRoom;
  showPlayerList2;
  showRoom2;

  constructor(private signInService:SignInService, 
              private playerListService:PlayerListService,
              private currentRoomService:CurrentRoomService) { }

  ngOnInit() {
    const ctrl = this;

    this.getCountOfUsers();
    this.updateRoomLists();

    this.showPlayerList = false;
    this.showRoom = true;

    this.showPlayerList2 = false;
    this.showRoom2 = false;

    this.socket.on('player list', function(list){
      ctrl.playerList = list;
      ctrl.playerListService.playerList = list;
      ctrl.playerCount = ctrl.playerListService.playerList.length;
    });

    this.socket.on('set up player list', function(list){
      ctrl.playerListService.playerList = list;
    });

    this.socket.on('the room', function(room){
      ctrl.currentRoomService.room = room;
      ctrl.roomName = ctrl.currentRoomService.room.name;
      ctrl.roomDescription = ctrl.currentRoomService.room.description;
    });
  }

  getCountOfUsers(): void {
    const ctrl = this;

    this.socket.on('connection count', function(data) {
      ctrl.connectionCount = data;
    });
  }

  updateRoomLists(): void{
    const ctrl = this;

    this.socket.on('update room lists', function(){
      ctrl.playerListService.updateRoomList();
      ctrl.roomList = ctrl.playerListService.playersInRoomList;
    });
  }

  switch1(){
    this.showRoom = true;
    this.showPlayerList = false;
  }

  switch2(){
    this.showRoom = false;
    this.showPlayerList = true;
  }

  switch3(){
    this.showRoom = false;
    this.showPlayerList = false;
  }

  switch4(){
    this.showRoom2 = true;
    this.showPlayerList2 = false;
  }

  switch5(){
    this.showRoom2 = false;
    this.showPlayerList2 = true;
  }

  switch6(){
    this.showRoom2 = false;
    this.showPlayerList2 = false;
  }

}
