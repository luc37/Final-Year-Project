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

  constructor(private signInService:SignInService, 
              private playerListService:PlayerListService,
              private currentRoomService:CurrentRoomService) { }

  ngOnInit() {
    const ctrl = this;

    this.getCountOfUsers();
    this.updateRoomLists();

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

}
