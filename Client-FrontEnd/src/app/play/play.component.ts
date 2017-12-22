import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  connection;
  textArea = '';
  socket;
  database = 'hello';

  @Input() userName = 'user';
  @Input() inputText;

  constructor(){}

  ngOnInit(): void {
	  this.socket = socketIo('http://139.59.179.135:3000');
    //this.socket = socketIo('http://localhost:3000');

    const ctrl = this;
    
    this.connection = 0;

    this.getCountOfUsers();
    this.recieveText();
    this.setUpDatabase();
  }

  getCountOfUsers(): void {
    const ctrl = this;

    this.socket.on('connection count', function(data) {
      ctrl.connection = data;
    });
  }

  ifEnter(event): void {
      this.sendText();
  }

  sendText(): void{
    const ctrl = this;

    this.textArea =  "me : " + this.inputText + "\n" + this.textArea;
    this.socket.emit('to server', ctrl.userName + " : " + ctrl.inputText);
    this.inputText = '';
  }

  recieveText() : void{
    const ctrl = this;

    this.socket.on('from server', function(data){
      ctrl.textArea = data + "\n" + ctrl.textArea;
    });
  }

  setUpDatabase() : void{
    const ctrl = this;

    this.socket.on('db', function(data){
      ctrl.database = data;
  });
  }

}
