import { Component, OnInit, Input } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { SignInService } from '../sign-in.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  socket;
  signedIn = false;
  characterName;

  constructor(private signInService:SignInService){}

  ngOnInit(): void {
    if(!this.signedIn){
      this.socket = socketIo('http://139.59.179.135:3000');
      //this.socket = socketIo('http://localhost:3000');
      const ctrl = this;

      if(this.signInService.character.characterName != null){
        this.signedIn = true;
        this.characterName = this.signInService.character.characterName;

        this.socket.emit('switch tabs', this.signInService.character);

        this.socket.on('new socket', function(data){
          ctrl.signInService.character.socketId = data;
        });
      }

      this.socket.on('checkSignIn', function(data){
        ctrl.signedIn = data.isChar;
        ctrl.characterName = data.name;

        ctrl.signInService.character.characterName = data.name;
        ctrl.signInService.character.characterId = data.id;
        ctrl.signInService.character.commands = data.commands;
        ctrl.signInService.character.socketId = data.socketId;
        ctrl.signInService.character.isChar = data.isChar;

        ctrl.socket.emit('resetPlayScreenPage', data);
      });
    }
  }

  checkSignIn(event): void{
    this.socket.emit('checkSignIn', event);
  }
}