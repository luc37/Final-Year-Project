import { Component, OnInit, Input } from '@angular/core';
import { SignInService } from '../../../sign-in.service';
import { PlayerListService } from '../../../player-list.service';

@Component({
  selector: 'game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  connectionCount;
  playerList;

  @Input() socket;
  @Input() characterName;

    
  roomList;

  constructor(private signInService:SignInService, private playerListService:PlayerListService) { }

  ngOnInit() {
    const ctrl = this;
    this.getCountOfUsers();
    this.updateRoomLists();

    this.socket.on('player list', function(list){
      ctrl.playerList = list;
      ctrl.playerListService.playerList = list;
    });

    this.socket.on('set up player list', function(list){
      ctrl.playerListService.playerList = list;
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
