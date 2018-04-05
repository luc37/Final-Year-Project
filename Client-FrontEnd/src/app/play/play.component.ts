import { Component, OnInit, Input } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { SignInService } from '../sign-in.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.less']
})
export class PlayComponent implements OnInit {
  socket;
  signedIn = false;
  characterName;
  characterCreated = false;

  constructor(private signInService:SignInService){}

  ngOnInit(): void {
    if(!this.signedIn){
      //this.socket = socketIo('http://139.59.179.135:3000');
      this.socket = socketIo('http://localhost:3000');
      const ctrl = this;

      if(this.signInService.character.name != null){
        this.signedIn = true;
        this.characterName = this.signInService.character.name;

        this.socket.emit('switch tabs', this.signInService.character);

        this.socket.on('new socket', function(data){
          ctrl.signInService.character.socketId = data;
        });
      }

      this.socket.on('checkSignIn', function(data){
        ctrl.signedIn = data.isChar;
        ctrl.characterName = data.name;

        ctrl.signInService.character.name = data.name;
        ctrl.signInService.character.id = data.id;
        ctrl.signInService.character.commandList = data.commandList;
        ctrl.signInService.character.socketId = data.socketId;
        ctrl.signInService.character.isChar = data.isChar;
        ctrl.signInService.character.roomId = data.roomId;
        ctrl.signInService.character.lookDirection = data.lookDirection;
        ctrl.signInService.character.smell = data.smell;
        ctrl.signInService.character.sound = data.sound;
        ctrl.signInService.character.health = data.health;
        ctrl.signInService.character.bullets = data.bullets;
        ctrl.signInService.character.gunPower = data.gunPower;
        ctrl.signInService.character.reload = data.reload;
        ctrl.signInService.character.aim = data.aim;
        ctrl.signInService.character.inventory = data.inventory;
        ctrl.signInService.character.clumsiness = data.clumsiness;
        ctrl.signInService.character.maxHealth = data.maxHealth;

        console.log(ctrl.signInService.character);

        ctrl.socket.emit('resetPlayScreenPage', data);
      });

      this.socket.on('create character', function(data){
        ctrl.characterCreated = true;
        ctrl.socket.emit('checkSignIn', data);
      });
    }
  }

  checkSignIn(event): void{
    this.socket.emit('checkSignIn', event);
  }

  createCharacter(event):void{
    this.socket.emit('create character', event);
  }
}