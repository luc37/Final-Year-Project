import { Component, OnInit, Input } from '@angular/core';
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
  database = 'database not connected';
  signedIn = false;

  @Input() userName = 'user';
  @Input() inputText;

  constructor(){}

  ngOnInit(): void {
	  this.socket = socketIo('http://139.59.179.135:3000');
    //this.socket = socketIo('http://localhost:3000');
    const ctrl = this;
 
    this.getCountOfUsers();
    this.recieveText();
    this.setUpDatabase();

    this.socket.on('checkSignIn', function(data){
      ctrl.signedIn = data;
      console.log(data);
    });
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

  checkSignIn(event): void{
    this.socket.emit('checkSignIn', event);
  }

}
