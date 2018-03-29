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

  showStats;
  showGameInfo;
  showStats2;
  showGameInfo2;

  constructor(private signInService:SignInService, 
              private currentRoomService:CurrentRoomService, 
              private playerListService:PlayerListService){}

  ngOnInit(): void {
    const ctrl = this;
    
    this.showStats = true;
    this.showGameInfo = false;

    this.showStats2 = false;
    this.showGameInfo2 = true;

    this.updateGame();
    this.recieveText();
    this.buildRoom();

    let myTimer = setInterval(function() {
      if(document.getElementById("input") === null){
        clearInterval(myTimer);
      } else if(!ctrl.excutingCommand){
        ctrl.getFocus();
      }
    }, 500);
    
  }

  ifEnter(event): void {
      this.runCommand();
  }

  runCommand(): void{
    const ctrl = this;
    let invalid = true;
    let i = 0;

    if(!this.excutingCommand){
      this.signInService.character.commandList.list.forEach(command => {
        command.activationStrings.forEach(activationString => {
          if(ctrl.inputText === activationString){
            invalid = false;
            
            let direction;

            if( command.name.includes('Walk') || 
                command.name.includes('Run') || 
                command.name.includes('Sneak') ||
                command.name.includes('Look')){ 
              if(command.name.includes('north')){
                direction = 'north';
              } else if(command.name.includes('east')){
                direction = 'east';
              } else if(command.name.includes('south')){
                direction = 'south';
              } else if(command.name.includes('west')) {
                direction = 'west';
              }
            }

            if(command.name.includes('Walk') || command.name.includes('Run') || command.name.includes('Sneak')){
              let noExit = true;

              ctrl.signInService.character.lookDirecion = direction;

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

            } else if(command.name.includes('Look')){
              ctrl.signInService.character.lookDirecion = direction;
              ctrl.command = command;
              ctrl.excutingCommand = true;

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

      if(ctrl.excutingCommand === true){
        if(ctrl.command.executingTime > 0){
          ctrl.command.executingTime = ctrl.command.executingTime -1
          ctrl.replaceLastText(ctrl.command.executingText + ' ... ' + ctrl.command.executingTime.toString());
          
          let addInfoText = ctrl.signInService.character.name + ' is ' + ctrl.command.executingText + ' ... ' + ctrl.command.executingTime.toString();
          
          let object = {
            id: ctrl.signInService.character.id,
            text: addInfoText,
            socketCall: ctrl.command.socketCall
          }
          ctrl.socket.emit('update additional info', object);

          if(ctrl.command.executionTime === ctrl.command.executingTime+1){
            
            let sound = {
              range: ctrl.command.soundValue,
              length: ctrl.command.executionTime,
              originId: ctrl.currentRoomService.room.id
            }
            ctrl.socket.emit('made a sound', sound);
          }

        }else{
          ctrl.replaceLastText('You ' + ctrl.command.completedText);

          ctrl.socket.emit(ctrl.command.socketCall, ctrl.signInService.character);
          
          let object = {
            id: ctrl.signInService.character.id,
            text: ctrl.signInService.character.name + ' ' + ctrl.command.completedText,
            socketCall: ctrl.command.socketCall
          }
          
          ctrl.socket.emit('update additional info', object);

          ctrl.excutingCommand = false;
          ctrl.command.executingTime = ctrl.command.executionTime;
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

  executingCheck(): boolean{
    return this.excutingCommand;
  }

  getFocus = function () {
      document.getElementById("input").focus();
  }

  switch1(){
    this.showStats = true;
    this.showGameInfo = false;
  }

  switch2(){
    this.showStats = false;
    this.showGameInfo = true;
  }

  switch3(){
    this.showStats = false;
    this.showGameInfo = false;
  }

  switch4(){
    this.showStats2 = true;
    this.showGameInfo2 = false;
  }

  switch5(){
    this.showStats2 = false;
    this.showGameInfo2 = true;
  }

  switch6(){
    this.showStats2 = false;
    this.showGameInfo2 = false;
  }
}
