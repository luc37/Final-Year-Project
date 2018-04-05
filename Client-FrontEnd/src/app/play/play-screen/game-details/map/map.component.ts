import { Component, OnInit, Input } from '@angular/core';
import { CurrentRoomService } from '../../../../current-room.service';
import { SignInService } from '../../../../sign-in.service';
import { PlayerListService } from '../../../../player-list.service';
import { AStarSearchService } from '../../../../a-star-search.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {

  squareList = [];
  @Input() socket;

  mapList = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 0, 0, 0, 
    0, 0, 0,11,12,13,14,15,16,17,18,19,20, 0, 0, 0, 
    0, 0, 0,21,22,23,24,25,26,27,28,29,30, 0, 0, 0, 
    0, 0, 0,31,32,33,34,35,36,37,38,39,40, 0, 0, 0, 
    0, 0, 0,41,42,43,44,45,46,47,48,49,50, 0, 0, 0, 
    0, 0, 0,51,52,53,54,55,56,57,58,59,60, 0, 0, 0, 
    0, 0, 0,61,62,63,64,65,66,67,68,69,70, 0, 0, 0, 
    0, 0, 0,71,72,73,74,75,76,77,78,79,80, 0, 0, 0, 
    0, 0, 0,81,82,83,84,85,86,87,88,89,90, 0, 0, 0, 
    0, 0, 0,91,92,93,94,95,96,97,98,99,100, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  map = [];
  direction = '';
  visibleRooms = [];
  visibleSquares = [];

  constructor(private currentRoomService:CurrentRoomService,
              private signInService:SignInService,
              private playerListService:PlayerListService,
              private aStarSearchService:AStarSearchService ) { }

  ngOnInit() {
    const ctrl = this;

    for(let i =1; i < 50; i++){
      let square = {
        text: i.toString(),
        id: i.toString(),
        hasPeople: false,
        hasSound: false,
        hasSmell: false
      }
      this.squareList.push(square);
    }

    this.socket.on('the room', function(data){

      console.log(data);

      let cRoom = ctrl.mapList.indexOf(ctrl.currentRoomService.room.position);

      let j = -4;

      ctrl.squareList.forEach(function(square, i){
        
        let room;
        if(i % 7 === 0){
          j = j +1;
        } 
        //16 is width + 3 and 3.  %7 is the coumn refernce.  j is the row reference
        room = ctrl.mapList[cRoom + (16*j) + (-3+(i%7))];    
        square.text = (room).toString();
        square.hasPeople = false;
        square.hasSound = false;
      });

      ctrl.socket.emit('colour ui map', null);
    });

    this.socket.on('colour ui map', function(map){
      ctrl.map = map;
      let cRoom;
      ctrl.direction = ctrl.signInService.character.lookDirection;

      ctrl.visibleRooms = [];
      ctrl.visibleSquares = [];

      ctrl.squareList.forEach(function(square){
        square.hasPeople = false;
        square.hasSound = false;
      });

      ctrl.squareList.forEach(function(square){
        if(square.text === '0'){
          document.getElementById(square.id).style.background = "grey";
          document.getElementById(square.id).style.border = "thick solid grey"; 
        } else if(square.id === '25'){
          document.getElementById(square.id).style.background = "cyan";
          document.getElementById(square.id).style.borderTop = "thick solid cyan";
          document.getElementById(square.id).style.borderBottom = "thick solid cyan"; 
          document.getElementById(square.id).style.borderRight = "thick solid cyan"; 
          document.getElementById(square.id).style.borderLeft = "thick solid cyan"; 
        } else {
          document.getElementById(square.id).style.background = "lightgrey";
          document.getElementById(square.id).style.borderTop = "thick solid lightgrey";
          document.getElementById(square.id).style.borderBottom = "thick solid lightgrey"; 
          document.getElementById(square.id).style.borderRight = "thick solid lightgrey"; 
          document.getElementById(square.id).style.borderLeft = "thick solid lightgrey";  
        }

        map.forEach(room => {
          if(square.text === room.position.toString()){

            if(square.id === '25'){
              ctrl.currentRoomService.room = room;
            }

            if(room.lit === false && square.id !== '25'){
              document.getElementById(square.id).style.background = "#566573";
            }

            if(room.northBoundary.allowsVisibility === 1){
              if(room.northBoundary.allowsAccess === 0){
                document.getElementById(square.id).style.borderTop = "thick solid red";
              }
            }else{
              if(room.northBoundary.allowsAccess === 1){
                document.getElementById(square.id).style.borderTop = "thick dashed black"; 
              } else {
                document.getElementById(square.id).style.borderTop = "thick solid black";
              }
            }

            if(room.eastBoundary.allowsVisibility === 1){
              if(room.eastBoundary.allowsAccess === 0){
                document.getElementById(square.id).style.borderRight = "thick solid red";
              }
            }else{
              if(room.eastBoundary.allowsAccess === 1){
                document.getElementById(square.id).style.borderRight = "thick dashed black"; 
              } else {
                document.getElementById(square.id).style.borderRight = "thick solid black"; 
              }
            }

            if(room.southBoundary.allowsVisibility === 1){
                if(room.southBoundary.allowsAccess === 0){
                  document.getElementById(square.id).style.borderBottom = "thick solid red";
                }
            }else{
              if(room.southBoundary.allowsAccess === 1){
                document.getElementById(square.id).style.borderBottom = "thick dashed black"; 
              } else {
                document.getElementById(square.id).style.borderBottom = "thick solid black"; 
              }
            }

            if(room.westBoundary.allowsVisibility === 1){
              if(room.westBoundary.allowsAccess === 0){
                document.getElementById(square.id).style.borderLeft = "thick solid red";
              }
            }else{
              if(room.westBoundary.allowsAccess === 1){
                document.getElementById(square.id).style.borderLeft = "thick dashed black"; 
              } else {
                document.getElementById(square.id).style.borderLeft = "thick solid black"; 
              } 
            }

            if(square.id === '25'){
              cRoom = room;
            }
          }
        });
      });

      let nSquare = ctrl.squareList[17];
      let nSquare2 = ctrl.squareList[10];
      let nSquare3 = ctrl.squareList[3];
      let nRoom, nRoom2, nRoom3;

      let eSquare = ctrl.squareList[25];
      let eSquare2 = ctrl.squareList[26];
      let eSquare3 = ctrl.squareList[27];
      let eRoom, eRoom2, eRoom3;

      let sSquare = ctrl.squareList[31];
      let sSquare2 = ctrl.squareList[38];
      let sSquare3 = ctrl.squareList[45];
      let sRoom, sRoom2, sRoom3;

      let wSquare = ctrl.squareList[23];
      let wSquare2 = ctrl.squareList[22];
      let wSquare3 = ctrl.squareList[21];
      let wRoom, wRoom2, wRoom3;

      let neSquare = ctrl.squareList[18];
      let seSquare = ctrl.squareList[32];
      let swSquare = ctrl.squareList[30];
      let nwSquare = ctrl.squareList[16];
      let neRoom, seRoom, swRoom, nwRoom;

      let nneSquare = ctrl.squareList[11];
      let neeSquare = ctrl.squareList[19];
      let nneRoom, neeRoom;

      let seeSquare = ctrl.squareList[33];
      let sseSquare = ctrl.squareList[39];
      let seeRoom, sseRoom;

      let sswSquare = ctrl.squareList[37];
      let swwSquare = ctrl.squareList[29];
      let sswRoom, swwRoom;

      let nwwSquare = ctrl.squareList[15];
      let nnwSquare = ctrl.squareList[9];
      let nwwRoom, nnwRoom;
      

      map.forEach(room => {
        if(room.position.toString() === nSquare.text){    nRoom = room;     }
        if(room.position.toString() === nSquare2.text){   nRoom2 = room;    }
        if(room.position.toString() === nSquare3.text){   nRoom3 = room;    }
        if(room.position.toString() === eSquare.text){    eRoom = room;     }
        if(room.position.toString() === eSquare2.text){   eRoom2 = room;    }
        if(room.position.toString() === eSquare3.text){   eRoom3 = room;    }
        if(room.position.toString() === sSquare.text){    sRoom = room;     }
        if(room.position.toString() === sSquare2.text){   sRoom2 = room;    }
        if(room.position.toString() === sSquare3.text){   sRoom3 = room;    }
        if(room.position.toString() === wSquare.text){    wRoom = room;     }
        if(room.position.toString() === wSquare2.text){   wRoom2 = room;    }
        if(room.position.toString() === wSquare3.text){   wRoom3 = room;    }
        if(room.position.toString() === neSquare.text){   neRoom = room;    }
        if(room.position.toString() === seSquare.text){   seRoom = room;    }
        if(room.position.toString() === swSquare.text){   swRoom = room;    }
        if(room.position.toString() === nwSquare.text){   nwRoom = room;    }
        if(room.position.toString() === nneSquare.text){   nneRoom = room;    }
        if(room.position.toString() === neeSquare.text){   neeRoom = room;    }
        if(room.position.toString() === seeSquare.text){   seeRoom = room;    }
        if(room.position.toString() === sseSquare.text){   sseRoom = room;    }
        if(room.position.toString() === sswSquare.text){   sswRoom = room;    }
        if(room.position.toString() === swwSquare.text){   swwRoom = room;    }
        if(room.position.toString() === nwwSquare.text){   nwwRoom = room;    }
        if(room.position.toString() === nnwSquare.text){   nnwRoom = room;    }
      });

      let lookD = ctrl.signInService.character.lookDirection;

      ctrl.findStraightSights(ctrl, cRoom, nRoom, nRoom2, nRoom3, nSquare, nSquare2, nSquare3, lookD, 
                              'northBoundary', 'southBoundary', 'south');

      ctrl.findStraightSights(ctrl, cRoom, eRoom, eRoom2, eRoom3, eSquare, eSquare2, eSquare3, lookD, 
                              'eastBoundary', 'westBoundary', 'west');

      ctrl.findStraightSights(ctrl, cRoom, sRoom, sRoom2, sRoom3, sSquare, sSquare2, sSquare3, lookD, 
                              'southBoundary', 'northBoundary', 'north');
                              
      ctrl.findStraightSights(ctrl, cRoom, wRoom, wRoom2, wRoom3, wSquare, wSquare2, wSquare3, lookD, 
                              'westBoundary', 'eastBoundary', 'east');

      ctrl.findOtherSights(ctrl, nSquare, eSquare, nRoom, eRoom, neRoom, neSquare, 
                          'eastBoundary', 'northBoundary', 'westBoundary', 'southBoundary');

      ctrl.findOtherSights(ctrl, sSquare, eSquare, sRoom, eRoom, seRoom, seSquare, 
                          'eastBoundary', 'southBoundary', 'westBoundary', 'northBoundary');

      ctrl.findOtherSights(ctrl, sSquare, wSquare, sRoom, wRoom, swRoom, swSquare, 
                          'westBoundary', 'southBoundary', 'eastBoundary', 'northBoundary');

      ctrl.findOtherSights(ctrl, nSquare, wSquare, nRoom, wRoom, nwRoom, nwSquare, 
                          'westBoundary', 'northBoundary', 'eastBoundary', 'southBoundary');
                          
      ctrl.findOtherSights(ctrl, nSquare2, neSquare, nRoom2, neRoom, nneRoom, nneSquare, 
                          'eastBoundary', 'northBoundary', 'westBoundary', 'southBoundary');
                          
      ctrl.findOtherSights(ctrl, neSquare, eSquare2, neRoom, eRoom2, neeRoom, neeSquare, 
                          'eastBoundary', 'northBoundary', 'westBoundary', 'southBoundary');

      ctrl.findOtherSights(ctrl, seSquare, eSquare2, seRoom, eRoom2, seeRoom, seeSquare, 
                          'eastBoundary', 'southBoundary', 'westBoundary', 'northBoundary');

      ctrl.findOtherSights(ctrl, sSquare2, seSquare, sRoom2, seRoom, sseRoom, sseSquare, 
                          'eastBoundary', 'southBoundary', 'westBoundary', 'northBoundary');

      ctrl.findOtherSights(ctrl, sSquare2, swSquare, sRoom2, swRoom, sswRoom, sswSquare, 
                          'westBoundary', 'southBoundary', 'eastBoundary', 'northBoundary');

      ctrl.findOtherSights(ctrl, swSquare, wSquare2, swRoom, wRoom2, swwRoom, swwSquare, 
                          'westBoundary', 'southBoundary', 'eastBoundary', 'northBoundary');

      ctrl.findOtherSights(ctrl, nwSquare, wSquare2, nwRoom, wRoom2, nwwRoom, nwwSquare, 
                          'westBoundary', 'northBoundary', 'eastBoundary', 'southBoundary');

      ctrl.findOtherSights(ctrl, nSquare2, nwSquare, nRoom2, nwRoom, nnwRoom, nnwSquare, 
                          'westBoundary', 'northBoundary', 'eastBoundary', 'southBoundary');      


      ctrl.signInService.character.visiblePlayers = []; 
      ctrl.visibleRooms.push(cRoom);
      ctrl.visibleSquares.push(ctrl.squareList[24]);

      ctrl.visibleRooms.forEach(function(room, i){
        ctrl.playerListService.playerList.forEach(character => {
          if(room !== undefined){
            if(character.roomId === room.id && character.id !== ctrl.signInService.character.id){
              ctrl.visibleSquares[i].hasPeople = true;
              ctrl.signInService.character.visiblePlayers.push(character);
            }
          }
        });
      });
    });

    this.socket.on('update sounds', function(sounds){
      ctrl.squareList.forEach(function(square){
        square.hasSound = false;
        sounds.forEach(sound => {
          if(sound.originId.toString() === square.text){

            let origin = Number(square.id) -1;
            let route = ctrl.aStarSearchService.aStarSearch(origin, 24, ctrl.map, ctrl.squareList);

            square.hasSound = ctrl.checkLoudness(square, route, sound);

            //console.log(route);
          }
        });
      });
    });

    this.socket.on('update smells', function(playerList){
      ctrl.squareList.forEach(function(square){
        square.hasSmell = false;
        playerList.forEach(player => {
          if(player.roomId.toString() === square.text){

            let origin = Number(square.id) -1;
            let route = ctrl.aStarSearchService.aStarSearch(origin, 24, ctrl.map, ctrl.squareList);

            square.hasSmell = ctrl.checkSmell(square, route, player);

            //console.log(route);
          }
        });
      });
    });
  }

  findStraightSights(ctrl, cRoom, nRoom, nRoom2, nRoom3, nSquare, nSquare2, nSquare3, lookD, n, s, opp){

    if(cRoom[n].allowsVisibility === 1 && nRoom !== undefined && lookD != opp){
      if(nRoom[s].allowsVisibility === 1 && nRoom.lit){
        document.getElementById(nSquare.id).style.background = "lightgreen";

        ctrl.visibleSquares.push(nSquare);
        ctrl.visibleRooms.push(nRoom);

        if(nRoom[n].allowsVisibility === 1 && nRoom2 !== undefined){
          if(nRoom2[s].allowsVisibility === 1 && nRoom2.lit){
            document.getElementById(nSquare2.id).style.background = "lightgreen";

            ctrl.visibleSquares.push(nSquare2);
            ctrl.visibleRooms.push(nRoom2);
  
            if(nRoom2[n].allowsVisibility === 1 && nRoom3 !== undefined){
              if(nRoom3[s].allowsVisibility === 1 && nRoom3.lit){
                document.getElementById(nSquare3.id).style.background = "lightgreen";

                ctrl.visibleSquares.push(nSquare3);
                ctrl.visibleRooms.push(nRoom3);
              }
            }  
          }
        }          
      }
    }
  }

  findOtherSights(ctrl, nSquare, eSquare, nRoom, eRoom, neRoom, neSquare, b1, b2, b3, b4){
    if(document.getElementById(nSquare.id).style.background === "lightgreen" && 
         document.getElementById(eSquare.id).style.background === "lightgreen"){

          if(nRoom[b1].allowsVisibility === 1 &&
             eRoom[b2].allowsVisibility === 1 &&
             neRoom[b3].allowsVisibility === 1 &&
             neRoom[b4].allowsVisibility === 1){
              document.getElementById(neSquare.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(neSquare);
              ctrl.visibleRooms.push(neRoom);
          }
      }
  }

  checkLoudness(square, route, sound){
    let bool = false;
    
    if(route !== 'no path'){
      if(route.distance <= sound.loudness){
        bool = true;
      }
    }

    return bool;
  }

  checkSmell(square, route, player){
    let bool = false;
    
    if(route !== 'no path'){
      if(route.distance <= player.smell && player.smell !== 0){
        bool = true;
      }
    }

    return bool;
  }

  ngAfterViewInit(){
    this.squareList.forEach(function(square){
      if(square.id === '25'){
        document.getElementById(square.id).style.background = "thick solid cyan";
        document.getElementById(square.id).style.border = "thick solid cyan"; 
      }
      
    });
  }
}
