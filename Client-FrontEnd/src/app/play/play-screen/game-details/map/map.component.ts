import { Component, OnInit, Input } from '@angular/core';
import { CurrentRoomService } from '../../../../current-room.service';
import { SignInService } from '../../../../sign-in.service';
import { PlayerListService } from '../../../../player-list.service';

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
              private playerListService:PlayerListService) { }

  ngOnInit() {
    const ctrl = this;

    for(let i =1; i < 50; i++){
      let square = {
        text: i.toString(),
        id: i.toString(),
        hasPeople: false
      }
      this.squareList.push(square);
    }

    this.socket.on('the room', function(data){

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
      });

      ctrl.socket.emit('colour ui map', null);
    });

    this.socket.on('colour ui map', function(map){
      ctrl.map = map;
      let cRoom;
      ctrl.direction = ctrl.signInService.character.lookDirecion;

      ctrl.visibleRooms = [];
      ctrl.visibleSquares = [];

      ctrl.squareList.forEach(function(square){
        square.hasPeople = false;
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

      let nSquare = ctrl.squareList[24-7];
      let nSquare2 = ctrl.squareList[24-14];
      let nSquare3 = ctrl.squareList[24-21];
      let nRoom, nRoom2, nRoom3;

      let eSquare = ctrl.squareList[24+1];
      let eSquare2 = ctrl.squareList[24+2];
      let eSquare3 = ctrl.squareList[24+3];
      let eRoom, eRoom2, eRoom3;

      let sSquare = ctrl.squareList[24+7];
      let sSquare2 = ctrl.squareList[24+14];
      let sSquare3 = ctrl.squareList[24+21];
      let sRoom, sRoom2, sRoom3;

      let wSquare = ctrl.squareList[24-1];
      let wSquare2 = ctrl.squareList[24-2];
      let wSquare3 = ctrl.squareList[24-3];
      let wRoom, wRoom2, wRoom3;

      let neSquare = ctrl.squareList[24-6];
      let seSquare = ctrl.squareList[24+8];
      let swSquare = ctrl.squareList[24+6];
      let nwSquare = ctrl.squareList[24-8];
      let neRoom, seRoom, swRoom, nwRoom;

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
      });

      let lookD = ctrl.signInService.character.lookDirecion;

      if(cRoom.northBoundary.allowsVisibility === 1 && nRoom !== undefined && lookD != 'south'){
        if(nRoom.southBoundary.allowsVisibility === 1){
          document.getElementById(nSquare.id).style.background = "lightgreen";

          ctrl.visibleSquares.push(nSquare);
          ctrl.visibleRooms.push(nRoom);

          if(nRoom.northBoundary.allowsVisibility === 1 && nRoom2 !== undefined){
            if(nRoom2.southBoundary.allowsVisibility === 1){
              document.getElementById(nSquare2.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(nSquare2);
              ctrl.visibleRooms.push(nRoom2);
    
              if(nRoom2.northBoundary.allowsVisibility === 1 && nRoom3 !== undefined){
                if(nRoom3.southBoundary.allowsVisibility === 1){
                  document.getElementById(nSquare3.id).style.background = "lightgreen";

                  ctrl.visibleSquares.push(nSquare3);
                  ctrl.visibleRooms.push(nRoom3);
                }
              }  
            }
          }          
        }
      }

      if(cRoom.eastBoundary.allowsVisibility === 1 && eRoom !== undefined && lookD != 'west'){
        if(eRoom.westBoundary.allowsVisibility === 1){
          document.getElementById(eSquare.id).style.background = "lightgreen";

          ctrl.visibleSquares.push(eSquare);
          ctrl.visibleRooms.push(eRoom);

          if(eRoom.eastBoundary.allowsVisibility === 1 && eRoom2 !== undefined){
            if(eRoom2.westBoundary.allowsVisibility === 1){
              document.getElementById(eSquare2.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(eSquare2);
              ctrl.visibleRooms.push(eRoom2);
    
              if(eRoom2.eastBoundary.allowsVisibility === 1 && eRoom3 !== undefined){
                if(eRoom3.westBoundary.allowsVisibility === 1){
                  document.getElementById(eSquare3.id).style.background = "lightgreen";

                  ctrl.visibleSquares.push(eSquare3);
                  ctrl.visibleRooms.push(eRoom3);
                }
              }  
            }
          }          
        }
      }

      if(cRoom.southBoundary.allowsVisibility === 1 && sRoom !== undefined && lookD != 'north'){
        if(sRoom.northBoundary.allowsVisibility === 1){
          document.getElementById(sSquare.id).style.background = "lightgreen";

          ctrl.visibleSquares.push(sSquare);
          ctrl.visibleRooms.push(sRoom);

          if(sRoom.southBoundary.allowsVisibility === 1 && sRoom2 !== undefined){
            if(sRoom2.northBoundary.allowsVisibility === 1){
              document.getElementById(sSquare2.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(sSquare2);
              ctrl.visibleRooms.push(sRoom2);
    
              if(sRoom2.southBoundary.allowsVisibility === 1 && sRoom3 !== undefined){
                if(sRoom3.northBoundary.allowsVisibility === 1){
                  document.getElementById(sSquare3.id).style.background = "lightgreen";

                  ctrl.visibleSquares.push(sSquare3);
                  ctrl.visibleRooms.push(sRoom3);
                }
              }  
            }
          }          
        }
      }

      if(cRoom.westBoundary.allowsVisibility === 1 && wRoom !== undefined && lookD != 'east'){
        if(wRoom.eastBoundary.allowsVisibility === 1){
          document.getElementById(wSquare.id).style.background = "lightgreen";

          ctrl.visibleSquares.push(wSquare);
          ctrl.visibleRooms.push(wRoom);

          if(wRoom.westBoundary.allowsVisibility === 1 && wRoom2 !== undefined){
            if(wRoom2.eastBoundary.allowsVisibility === 1){
              document.getElementById(wSquare2.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(wSquare2);
              ctrl.visibleRooms.push(wRoom2);
    
              if(wRoom2.westBoundary.allowsVisibility === 1 && wRoom3 !== undefined){
                if(wRoom3.eastBoundary.allowsVisibility === 1){
                  document.getElementById(wSquare3.id).style.background = "lightgreen";

                  ctrl.visibleSquares.push(wSquare3);
                  ctrl.visibleRooms.push(wRoom3);
                }
              }  
            }
          }          
        }
      }

      if(document.getElementById(nSquare.id).style.background === "lightgreen" && 
         document.getElementById(eSquare.id).style.background === "lightgreen"){

          if(nRoom.eastBoundary.allowsVisibility === 1 &&
             eRoom.northBoundary.allowsVisibility === 1 &&
             neRoom.westBoundary.allowsVisibility === 1 &&
             neRoom.southBoundary.allowsVisibility === 1){
              document.getElementById(neSquare.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(neSquare);
              ctrl.visibleRooms.push(neRoom);
          }
      }

      if(document.getElementById(sSquare.id).style.background === "lightgreen" && 
         document.getElementById(eSquare.id).style.background === "lightgreen"){

          if(sRoom.eastBoundary.allowsVisibility === 1 &&
            eRoom.southBoundary.allowsVisibility === 1 &&
            seRoom.westBoundary.allowsVisibility === 1 &&
            seRoom.northBoundary.allowsVisibility === 1){
              document.getElementById(seSquare.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(seSquare);
              ctrl.visibleRooms.push(seRoom);
         }
      }

      if(document.getElementById(sSquare.id).style.background === "lightgreen" && 
         document.getElementById(wSquare.id).style.background === "lightgreen"){
          
          if(sRoom.westBoundary.allowsVisibility === 1 &&
            wRoom.southBoundary.allowsVisibility === 1 &&
            swRoom.eastBoundary.allowsVisibility === 1 &&
            swRoom.northBoundary.allowsVisibility === 1){
              document.getElementById(swSquare.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(swSquare);
              ctrl.visibleRooms.push(swRoom);
         }
      }

      if(document.getElementById(nSquare.id).style.background === "lightgreen" && 
         document.getElementById(wSquare.id).style.background === "lightgreen"){
          
          if(nRoom.westBoundary.allowsVisibility === 1 &&
            wRoom.northBoundary.allowsVisibility === 1 &&
            nwRoom.eastBoundary.allowsVisibility === 1 &&
            nwRoom.southBoundary.allowsVisibility === 1){
              document.getElementById(nwSquare.id).style.background = "lightgreen";

              ctrl.visibleSquares.push(nwSquare);
              ctrl.visibleRooms.push(nwRoom);
         }
      }

      ctrl.visibleRooms.forEach(function(room, i){
        ctrl.playerListService.playerList.forEach(character => {
          if(room !== undefined){
            if(character.roomId === room.id && character.id !== ctrl.signInService.character.id){
              ctrl.visibleSquares[i].hasPeople = true;
              console.log(room.id);
              console.log(character.roomId);
              console.log(ctrl.visibleSquares);
            }
          }
        });
      });

    });
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
