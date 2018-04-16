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
  actionsList = [];
  itemPickedUp = 0;
  droppedItem = 0;
  turnOnItem = 0;
  hideItem = 0;
  foundBomb = false;
  detonateItem = 0;

  @Input() socket;
  @Input() characterName;
  @Input() inputText;

  showStats;
  showGameInfo;
  showStats2;
  showGameInfo2;

  constructor(public signInService:SignInService, 
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

    this.socket.on('you died', function(d){
      ctrl.displayText(d.deadText);
      ctrl.signInService.character = d.character;
    });

    this.socket.on('game won', function(winText){
      ctrl.displayText(winText);
    });

    this.socket.on('explosion', function(){
      ctrl.socket.emit('move to room', {character:ctrl.signInService.character});
    });

    this.socket.on('update actions', function(actions){
      ctrl.actionsList = actions;

      ctrl.actionsList.forEach(function(action){
        ctrl.signInService.character.visiblePlayers.forEach(function(character){
          //console.log(action);
          if(action.instigator === character.name && action.instigator !== ctrl.signInService.character.name){
            if(action.target === ctrl.signInService.character.name){
              ctrl.updateActionText( ctrl, action.instigator, action.instigator  + ' is ' +  action.text + 'you');
            } else if(action.command.status === ''){
              ctrl.updateActionText( ctrl, action.instigator, action.instigator  + ' is ' +  action.text + action.target);
            } else if(action.command.status !== 0){
              ctrl.updateActionText( ctrl, action.instigator, action.instigator  + ' is ' +  action.text + action.command.status);
            }
          }
        });
      });
    });

    this.socket.on('action completed', function(action){
      ctrl.signInService.character.visiblePlayers.forEach(function(character){
        if(action.instigator === character.name && action.instigator !== ctrl.signInService.character.name){
          if(action.target === ctrl.signInService.character.name){
            ctrl.updateActionText( ctrl, action.instigator, action.instigator + ' ' + action.completedText + 'you');
          } else if(action.command.status === ''){
            ctrl.updateActionText( ctrl, action.instigator, action.instigator + ' ' + action.completedText + action.target);
          } else if(action.command.status !== 0){
            ctrl.updateActionText( ctrl, action.instigator, action.instigator + ' ' + action.completedText + action.command.status);
          }
        }
      });

      ctrl.playerListService.allCharactersList.forEach(function(character){
        if(action.instigator === character.name && action.instigator !== ctrl.signInService.character.name){
          if(action.target === ctrl.signInService.character.name){
            if(action.command.name === 'Shoot'){
              ctrl.displayText('Shot! Bullet caused ' + character.gunPower + '  damage to your health');
              ctrl.signInService.character.health = ctrl.signInService.character.health - character.gunPower;
              ctrl.signInService.character.clumsiness = ctrl.signInService.character.clumsiness +2;
              ctrl.socket.emit('been shot', ctrl.signInService.character);
            }
          }
        }
      });

    });

    ctrl.socket.on('update smells', function(playerList){
      playerList.forEach(character => {
        if(character.id === ctrl.signInService.character.id){
          ctrl.signInService.character.smell = character.smell;
        }
      });
      ctrl.playerListService.setLists(playerList);
    });

    ctrl.socket.on('bomb going off', function(timer){
      ctrl.updateActionText(ctrl, 'bomb',  'bomb going off in : ' + timer);
    });

    ctrl.socket.on('bomb exploded', function(){
      ctrl.updateActionText(ctrl, 'bomb',  'bomb exploded');
    });

    ctrl.socket.on('update inventory', function(inventory){
      ctrl.signInService.character.inventory = inventory;
    });

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
    let i = 0, j = 0;

    this.itemPickedUp=0;

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

              ctrl.signInService.character.lookDirection = direction;

              ctrl.currentRoomService.room.exits.forEach(exit => {
                exit.activationCommands.forEach(exitCommand => {

                  if(activationString === exitCommand){
                    console.log('there is a room ' + direction + ', going north to room : ' + exit.destinationId);
                    ctrl.signInService.character.roomId = exit.destinationId;

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
              ctrl.signInService.character.lookDirection = direction;
              ctrl.command = command;
              ctrl.excutingCommand = true;

            } else if(command.name === 'Lights'){
              
              if(ctrl.currentRoomService.room.hasOwnProperty('lights')){
                let lightOn;
                if(ctrl.currentRoomService.room.lit === true){
                  lightOn = true;
                  ctrl.currentRoomService.room.lit = false;
                } else {
                  lightOn = false;
                  ctrl.currentRoomService.room.lit = true;
                }
  
                if(this.inputText.endsWith('on')){
                  if(lightOn){
                    ctrl.displayText('Lights are already ON.');
                  } else {
                    ctrl.command = command;
                    ctrl.excutingCommand = true;
                    ctrl.command.status = 'on';
                  }
                } else if(this.inputText.endsWith('off')){
                  if(lightOn){
                    ctrl.command = command;
                    ctrl.excutingCommand = true;
                    ctrl.command.status = 'off';
                  } else {
                    ctrl.displayText('Lights are already OFF.');
                  }
                }
              } else{
                ctrl.displayText('There is no light switch here');
              }
    
            } else if(command.name === 'Reset Game'){
              invalid = false;
              ctrl.command = command;
              ctrl.excutingCommand = true;
            } else if(false){
              //another command
            }
          } else{

            if(this.inputText.startsWith(activationString)){
              if(command.name === 'Shoot'){
                ctrl.signInService.character.visiblePlayers.forEach(function(character){
                  if(ctrl.inputText.endsWith(character.name)){
                    if(ctrl.signInService.character.bullets > 0){
                      invalid = false;
                      ctrl.command = command;
                      ctrl.excutingCommand = true;
                      ctrl.command.target = character.name;
                      ctrl.signInService.character.bullets = ctrl.signInService.character.bullets -1;
                    } else{
                      ctrl.displayText('Out of bullets.');
                      invalid = false;
                    }
                    
                  }
                });
              } else if(command.name ==='Search'){
                if(j < 1){
                  j++;
                  invalid = ctrl.checkItemIsInRoom(ctrl, command, 'Search');
                }
              } else if(command.name ==='Hide'){
                if(j < 1){
                  j++;
                  invalid = ctrl.checkItemIsInRoom(ctrl, command, 'Hide'); 
                }
              } else if(command.name ==='Turn on'){
                if(j < 1){
                  j++;
                  invalid = ctrl.checkItemIsInInventory(ctrl, command, 'TurnOn');
                  if(invalid){
                    invalid = ctrl.checkItemIsInRoom(ctrl, command, 'TurnOn');
                  }
                }
              } else if(command.name ==='Turn off'){
                if(j < 1){
                  j++;
                  invalid = ctrl.checkItemIsInInventory(ctrl, command, 'TurnOn');
                  if(invalid){
                    invalid = ctrl.checkItemIsInRoom(ctrl, command, 'TurnOn');
                  }
                }
              } else if(command.name ==='Pick Up'){
                if(j < 1){
                  if(ctrl.signInService.character.inventory.length < 3){
                    j++;
                    invalid = ctrl.checkItemIsInRoom(ctrl, command, 'PickUp');
                  } else{
                    invalid = false;
                    ctrl.displayText('Too many items in inventory');
                  }
                }
              } else if(command.name ==='Drop'){
                if(j < 1){
                  j++;
                  invalid = ctrl.checkItemIsInInventory(ctrl, command, 'PickUp');
                }
              } else if(command.name ==='Eat'){
                if(j < 1){
                  j++;
                  invalid = ctrl.checkItemIsInRoom(ctrl, command, 'Eat');
                }
              } else if(command.name ==='Detonate'){
                if(j < 1){
                  j++;
                  invalid = ctrl.checkItemIsInInventory(ctrl, command, 'PickUp');
                  if(invalid){
                    invalid = ctrl.checkItemIsInRoom(ctrl, command, 'PickUp');
                    if(invalid){
                      ctrl.displayText('bomb has been destroyed');
                    }
                  }
                }
              }
            }
            

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
        });
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
        if(ctrl.command.target === undefined){
          ctrl.command.target = '';
        }

        if(ctrl.command.status === undefined){
          ctrl.command.status = '';
        }

        if(ctrl.command.name !== 'Hide' && ctrl.signInService.character.hiding === true){
          ctrl.socket.emit('check hiding', {command: ctrl.command, character: ctrl.signInService.character});
        }

        if(ctrl.command.executingTime > 0){
          ctrl.command.executingTime = ctrl.command.executingTime -1;
          
          if(ctrl.command.executionTime === ctrl.command.executingTime+1){ 
            ctrl.displayText('You are ' + ctrl.command.executingText + ctrl.command.target +
                             ctrl.command.status + ' ... ' + ctrl.command.executingTime.toString());
          } else{
            ctrl.updateActionText(ctrl, 'You', 'You are ' + ctrl.command.executingText + ctrl.command.target +
                                  ctrl.command.status + ' ... ' + ctrl.command.executingTime.toString());
          }
             
          let addInfoText = ctrl.signInService.character.name + ' is ' + ctrl.command.executingText + 
                            ctrl.command.status + ctrl.command.target +' ... ' + ctrl.command.executingTime.toString();

          let object = {
            id: ctrl.signInService.character.id,
            text: addInfoText,
            socketCall: ctrl.command.socketCall
          }
          ctrl.socket.emit('update additional info', object);

          if(ctrl.command.executionTime === ctrl.command.executingTime+1){
            let sound = {
              loudness: ctrl.command.loudness,
              length: ctrl.command.executionTime,
              originId: ctrl.currentRoomService.room.id
            }
            ctrl.signInService.character.sound = sound.loudness;

            if(sound.loudness > 0){
              ctrl.socket.emit('made a sound', sound);
            }
            ctrl.socket.emit('update actions', {command: ctrl.command, instigator: ctrl.signInService.character.name, target: ctrl.command.target});
          }

        }else{
          if(ctrl.command.executionTime > 0){
            ctrl.updateActionText(ctrl, 'You', 'You ' + ctrl.command.completedText + ctrl.command.target + ctrl.command.status);
          } else {
            ctrl.displayText('You ' + ctrl.command.completedText + ctrl.command.target + ctrl.command.status);
          }

          if(ctrl.command.name === 'Eat'){
            if(ctrl.signInService.character.health < ctrl.signInService.character.maxHealth){
              ctrl.signInService.character.health = ctrl.signInService.character.health + 1;
              if(ctrl.signInService.character.clumsiness > 0){
                ctrl.signInService.character.clumsiness = ctrl.signInService.character.clumsiness - 1;
              }
            } else{
              ctrl.displayText('Max health reached.');
            }
            ctrl.signInService.character.smell = ctrl.signInService.character.smell + 2;
          } else if(ctrl.command.name === 'Search'){
              ctrl.foundBomb = false;
            ctrl.currentRoomService.room.objects.forEach(o => {
              if(o.name === 'Bomb'){
                ctrl.foundBomb = true;
              }
            });
            if(ctrl.foundBomb){
              ctrl.displayText('Revealed the bomb.');
            } else{
              ctrl.displayText('Found a bullet.');
              ctrl.signInService.character.bullets = ctrl.signInService.character.bullets + 1;
            }
          } else if(ctrl.command.name === 'Hide'){
            ctrl.signInService.character.hiding = true;
          }
          
          ctrl.socket.emit(ctrl.command.socketCall, { character: ctrl.signInService.character, 
                                                      room: ctrl.currentRoomService.room,
                                                      roomList: ctrl.playerListService.playersInRoomList,
                                                      itemPickedUp: ctrl.itemPickedUp,
                                                      itemDropped: ctrl.droppedItem,
                                                      itemTurnedOn: ctrl.turnOnItem,
                                                      hideItem: ctrl.hideItem,
                                                      foundBomb: ctrl.foundBomb,
                                                      detonateItem: ctrl.detonateItem});
          
          let object = {
            id: ctrl.signInService.character.id,
            text: ctrl.signInService.character.name + ' ' + ctrl.command.completedText + ctrl.command.target,
            socketCall: ctrl.command.socketCall
          }
          
          ctrl.socket.emit('update additional info', object);

          ctrl.excutingCommand = false;
          ctrl.command.executingTime = ctrl.command.executionTime;

          ctrl.signInService.character.sound = 0;
          if(ctrl.itemPickedUp !== 0 ){
            ctrl.signInService.character.inventory.push(ctrl.itemPickedUp);
            console.log(ctrl.signInService.character);
          }
        }
      }
    });
  }

  buildRoom(): void{
    const ctrl = this;

    this.socket.on('the room', function(room){
      ctrl.currentRoomService.room = room;

      let text = room.description;

      if(room.hasOwnProperty('lights')){
        room.lights.forEach(object => {
          text = text + ' ' + object.displayText + '. ';
        });
      }

      if(room.hasOwnProperty('objects')){

        let names = [];
        let strings = [];
        let nameSet = [];

        room.objects.forEach(object => {

          if(object.visible === true){
            names.push(object.name);
            let oName = object.name;
            let i = 0;
  
            names.forEach(function(name){
              if(oName === name){
                i++;
              }
            });
  
            if(i > 1){
              if(object.containerPlural === ''){
                strings.push('There are ' + i + ' '+ object.plural);
              } else {
                strings.push('There are ' + i + ' ' + object.containerPlural + ' ' + object.plural);
              }
            } else {
              let gap = '';
              if(object.flavourText !== ''){
                gap = ' ';
              }
              if(object.containerSingular === ''){
                strings.push('There is a ' + object.flavourText + gap + object.singular);
              } else {
                strings.push('There is a ' + object.flavourText + gap + object.containerSingular + ' ' + object.plural);
              }
              
              nameSet.push(object.name);
            }
          }
          
        });

        nameSet.forEach(function(name, p){
          let j = 0;
          for(let i = strings.length; i-- > 0; ){
            if(name === names[i] && j === 0){
              if(p === 0){
                text = text + ' ' + strings[i];
              } else if(p+1 === nameSet.length){
                if(strings[i].startsWith('There is')){
                  strings[i] = strings[i].replace('There is', '');
                } else{
                  strings[i] = strings[i].replace('There are', '');
                }
                text = text + ' and' + strings[i] + '. ';
              } else{
                if(strings[i].startsWith('There is')){
                  strings[i] = strings[i].replace('There is', '');
                } else{
                  strings[i] = strings[i].replace('There are', '');
                }
                 text = text + ',' + strings[i];
              }
              j++;
            }
          }
        });
      }

      if(!room.lit){
        text = 'Its pitch black. You can\'t see a thing.';
      }
      ctrl.displayText(text);

      ctrl.playerListService.updateRoomList();

      ctrl.socket.emit('update room lists', null);
    });
  }

  displayText(text): void{
    this.textArea =  text + "\n\n" + this.textArea ;
  }

  replaceLastText(text): void{
    let firstLine = this.textArea.split('\n')[0];

    this.textArea = this.textArea.replace(firstLine, text);
  }

  updateActionText(ctrl, character, text): void{
    
    let lines = ctrl.textArea.split('\n');
    let j = 0;
    let inArea = false;

    lines.forEach(function(line,i){
      if(line.startsWith(character)){
        if(j === 0){
          if(i < 6){
            ctrl.textArea = ctrl.textArea.replace(line, text);
            inArea = true;
          }
        }
        j++;
      }
    });

    if(inArea === false){
      ctrl.displayText(text);
    }
    
  }

  checkItemIsInRoom(ctrl, command, type): any{          
    let invalid = true;
    ctrl.currentRoomService.room.objects.forEach(item => {
      if(ctrl.inputText.endsWith(item.singular) && item.type.includes(type)){
        invalid = false;
        ctrl.command = command;
        ctrl.excutingCommand = true;
        ctrl.command.target = 'a ' + item.singular;
        if(type.includes('PickUp')){
          if(command.name === 'Detonate'){
            ctrl.detonateItem = item;
          } else{
            ctrl.itemPickedUp = item;
          }
        } else if(type.includes('TurnOn')){
          ctrl.turnOnItem = item;
        } else if(type.includes('Hide')){
          ctrl.hideItem = item;
          ctrl.command.target =  item.hideWord + ' a ' + item.singular;
          ctrl.command.status = '';
        }
      } else if(ctrl.inputText.endsWith(item.plural)){
        invalid = false;
        ctrl.command = command;
        ctrl.excutingCommand = true;
        ctrl.command.target =  'the ' + item.plural;
      }
    });

    return invalid;
  }

  checkItemIsInInventory(ctrl, command, type): any{          
    let invalid = true;
    ctrl.signInService.character.inventory.forEach(item => {
      if(ctrl.inputText.endsWith(item.singular) && item.type.includes(type)){
        invalid = false;
        ctrl.command = command;
        ctrl.excutingCommand = true;
        ctrl.command.target = 'a ' + item.singular;
        if(type.includes('PickUp')){
          if(command.name === 'Detonate'){
            ctrl.detonateItem = item;
          } else{
            ctrl.droppedItem = item;
          }
        } else if(type.includes('TurnOn')){
          ctrl.turnOnItem = item;
        }
      } else if(ctrl.inputText.endsWith(item.plural)){
        invalid = false;
        ctrl.command = command;
        ctrl.excutingCommand = true;
        ctrl.command.target =  'the ' + item.plural;
      }
    });

    return invalid;
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
