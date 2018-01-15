import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  connectionCount;
  database = 'database not connected';

  @Input() socket;
  @Input() characterName;

  constructor() { }

  ngOnInit() {
    this.getCountOfUsers();
    this.setUpDatabase();
  }

  getCountOfUsers(): void {
    const ctrl = this;

    this.socket.on('connection count', function(data) {
      ctrl.connectionCount = data;
    });
  }

  setUpDatabase() : void{
    const ctrl = this;

    this.socket.on('db', function(data){
      ctrl.database = data;
    });
  }

}
