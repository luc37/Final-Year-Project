import { Component, OnInit, Input } from '@angular/core';
import { SignInService } from '../../../sign-in.service';
import { CurrentRoomService } from '../../../current-room.service';
import { PlayerListService } from '../../../player-list.service';

@Component({
  selector: 'game-interface',
  templateUrl: './game-interface.component.html',
  styleUrls: ['./game-interface.component.css']
})
export class GameInterfaceComponent implements OnInit {
  textArea = '';

  @Input() socket;
  @Input() characterName;
  @Input() inputText;
  
  constructor(private signInService:SignInService, 
              private currentRoomService:CurrentRoomService, 
              private playerListService:PlayerListService){}

  ngOnInit(): void {
    this.updateGame();
    this.recieveText();
    this.buildRoom();
  }

  ifEnter(event): void {
      this.runCommand();
  }

  runCommand(): void{
    const ctrl = this;
    let invalid = true;
    let i = 0;

    this.signInService.character.commands.list.forEach(command => {
      command.activationStrings.forEach(activationString => {
        if(ctrl.inputText === activationString){
          invalid = false;

          if(command.name.includes('Exit room')){
            let direction;
            if(command.name === 'Exit room north'){
              direction = 'north';
            } else if(command.name === 'Exit room east'){
              direction = 'east';
            } else if(command.name === 'Exit room south'){
              direction = 'south';
            } else if(command.name === 'Exit room west') {
              direction = 'west';
            }

            let noExit = true;

            ctrl.currentRoomService.room.exits.forEach(exit => {
              exit.activationCommands.forEach(exitCommand => {
                if(activationString === exitCommand){
                  console.log('there is a room ' + direction + ', going north to room : ' + exit.destinationId);
                  ctrl.signInService.character.roomId = exit.destinationId;

                  ctrl.displayText('you move ' + direction);
                  ctrl.socket.emit('move to room', ctrl.signInService.character);

                  noExit = false;
                }
              });
            });
            
            if(noExit){
              console.log('no exit to the ' + direction);
              ctrl.displayText('There is no exit to the ' + direction);
            }
          } else if(false){
            //another command
          } else if(false){
            //another command
          } else{
            //unkown command
          }
        } else{

          if(this.inputText.startsWith('Say') || this.inputText.startsWith('say')){
            invalid = false;

            if(i < 1 ){
              let result = this.inputText.substr(this.inputText.indexOf(" ") + 1);

              this.displayText("me : " + result);
              this.socket.emit('to server', ctrl.characterName + " : says" + result);
            }
            i ++;
          }
        }
      })
    });

    if(invalid){
      this.displayText('Thats not a valid command');
    }

    this.inputText = '';
  }

  recieveText(): void{
    const ctrl = this;

    this.socket.on('from server', function(data){
      ctrl.displayText(data);
    });
  }

  updateGame(): void{
    const ctrl = this;

    this.socket.on('updateGame', function(data){
      if(data !== 'Update Game'){
        ctrl.displayText(data);
      }
    });
  }

  buildRoom(): void{
    const ctrl = this;

    this.socket.on('the room', function(room){
      ctrl.currentRoomService.room = room;
      ctrl.displayText(ctrl.currentRoomService.room.description);

      ctrl.playerListService.updateRoomList();

      ctrl.socket.emit('update room lists', null);
    });
  }

  displayText(text): void{
    this.textArea =  text + "\n\n" + this.textArea ;
  }

}
