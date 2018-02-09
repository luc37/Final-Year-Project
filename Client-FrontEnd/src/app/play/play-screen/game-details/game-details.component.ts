import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    const ctrl = this;
    this.getCountOfUsers();

    this.socket.on('player list', function(data){
      ctrl.playerList = data;
    });
  }

  getCountOfUsers(): void {
    const ctrl = this;

    this.socket.on('connection count', function(data) {
      ctrl.connectionCount = data;
    });
  }

}
