import { Component, OnInit, Input } from '@angular/core';
import { SignInService } from '../../../sign-in.service';
import { CurrentRoomService } from '../../../current-room.service';
import { PlayerListService } from '../../../player-list.service';

@Component({
  selector: 'game-interface',
  templateUrl: './game-interface.component.html',
  styleUrls: ['./game-interface.component.less']
})
export class GameInterfaceComponent implements OnInit {
  textArea = '';
  command;
  excutingCommand = false;

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

    this.signInService.character.commandList.list.forEach(command => {
      command.activationStrings.forEach(activationString => {
        if(ctrl.inputText === activationString){
          invalid = false;

          if(command.name.includes('Walk') || command.name.includes('Run') || command.name.includes('Sneak') ){
            let direction;
            if(command.name.includes('north')){
              direction = 'north';
            } else if(command.name.includes('east')){
              direction = 'east';
            } else if(command.name.includes('south')){
              direction = 'south';
            } else if(command.name.includes('west')) {
              direction = 'west';
            }

            let noExit = true;

            ctrl.currentRoomService.room.exits.forEach(exit => {
              exit.activationCommands.forEach(exitCommand => {

                if(activationString === exitCommand){
                  console.log('there is a room ' + direction + ', going north to room : ' + exit.destinationId);
                  ctrl.signInService.character.roomId = exit.destinationId;

                  ctrl.displayText(command.executingText + ' ... ' + command.executionTime.toString());

                  ctrl.command = command;
                  ctrl.excutingCommand = true;

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
          }
        } else{

          if(this.inputText.startsWith('Say') || this.inputText.startsWith('say')){
            invalid = false;

            if(i < 1 ){
              let result = this.inputText.substr(this.inputText.indexOf(" ") + 1);

              this.displayText("me : " + result);
              this.socket.emit('to server', ctrl.characterName + " : says " + result);
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

      if(ctrl.excutingCommand === true){
        if(ctrl.command.executionTime > 0){
          ctrl.command.executionTime = ctrl.command.executionTime -1
          ctrl.replaceLastText(ctrl.command.executingText + ' ... ' + ctrl.command.executionTime.toString());
          
          let addInfoText = ctrl.signInService.character.name + ' is ' + ctrl.command.executingText + ' ... ' + ctrl.command.executionTime.toString();
          let arr = [ctrl.signInService.character.id, addInfoText];
          ctrl.socket.emit('update additional info', arr);
        }else{
          ctrl.replaceLastText('You ' + ctrl.command.completedText);

          ctrl.socket.emit(ctrl.command.socketCall, ctrl.signInService.character);
          
          let arr = [ctrl.signInService.character.id, ctrl.signInService.character.name + ' ' + ctrl.command.completedText]
          ctrl.socket.emit('update additional info', arr);

          ctrl.excutingCommand = false;
        }
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

  replaceLastText(text): void{
    var firstLine = this.textArea.split('\n')[0];

    this.textArea = this.textArea.replace(firstLine, text);
  }

}
