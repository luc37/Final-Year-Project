import { Component, OnInit, Input } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  socket;
  signedIn = false;
  characterName;

  constructor(){}

  ngOnInit(): void {
	  this.socket = socketIo('http://139.59.179.135:3000');
    //this.socket = socketIo('http://localhost:3000');
    const ctrl = this;

    this.socket.on('checkSignIn', function(data){
      ctrl.signedIn = data.isChar;
      ctrl.characterName = data.characterName;

      ctrl.socket.emit('resetPlayScreenPage', data);
    });
  }

  checkSignIn(event): void{
    this.socket.emit('checkSignIn', event);
  }
}