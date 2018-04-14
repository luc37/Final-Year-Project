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

  @Input() socket;
  @Input() characterName;
    
  roomList;
  playerCount;

  roomName;
  roomDescription;

  showPlayerList;
  showRoom;
  showVisiblePlayers;
  showPlayerList2;
  showRoom2;
  showVisiblePlayers2;

  constructor(public signInService:SignInService, 
              public playerListService:PlayerListService,
              public currentRoomService:CurrentRoomService) { }

  ngOnInit() {
    const ctrl = this;

    this.getCountOfUsers();
    this.updateRoomLists();

    this.showPlayerList = false;
    this.showRoom = true;

    this.showPlayerList2 = false;
    this.showRoom2 = false;

    this.showVisiblePlayers = false;
    this.showVisiblePlayers = false;

    this.socket.on('player list', function(list){
      ctrl.playerListService.setLists(list);
    });

    this.socket.on('set up player list', function(list){
      ctrl.playerListService.setLists(list);
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
    this.showVisiblePlayers = false;
  }

  switch2(){
    this.showRoom = false;
    this.showPlayerList = true;
    this.showVisiblePlayers = false;
  }

  switch7(){
    this.showRoom = false;
    this.showPlayerList = false;
    this.showVisiblePlayers = true;
  }

  switch3(){
    this.showRoom = false;
    this.showPlayerList = false;
    this.showVisiblePlayers = false;
  }

  switch4(){
    this.showRoom2 = true;
    this.showPlayerList2 = false;
    this.showVisiblePlayers2 = false;
  }

  switch5(){
    this.showRoom2 = false;
    this.showPlayerList2 = true;
    this.showVisiblePlayers2 = false;
  }

  switch6(){
    this.showRoom2 = false;
    this.showPlayerList2 = false;
    this.showVisiblePlayers2 = false;
  }

  switch8(){
    this.showRoom2 = false;
    this.showPlayerList2 = false;
    this.showVisiblePlayers2 = true;
  }

}
