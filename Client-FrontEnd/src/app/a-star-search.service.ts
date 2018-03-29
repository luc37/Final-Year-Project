import { Injectable } from '@angular/core';

@Injectable()
export class AStarSearchService {

  constructor() { }

  aStarSearch(origin, target, map, squareList): any{
    let route = [];

    let openList = [];
    let closedList = [];

    let nodeList = [];

    const ctrl = this;

    console.log(origin);
    console.log(target);

    if(origin === target){
      console.log('in same place');
      return route;
    }

    squareList.forEach(square => {
      map.forEach(room => {

        let known = [];

        if(room.id.toString() === square.text){
          let node = {
            h: 0,
            g: 0,
            f: 0,
            p: 0,
            north: room.northBoundary.allowsSound,
            east: room.eastBoundary.allowsSound,
            south: room.southBoundary.allowsSound,
            west: room.westBoundary.allowsSound,
            square: square.id.toString(),
            id: Number(square.id) -1
          }
          nodeList.push(node);
        } else if(square.text === '0'){

          let inList = false;
          nodeList.forEach(function(node){
            if(node.square === square.id){
              inList = true;
            }
          });

          if(!inList){
            let node = {
              h: 0,
              g: 0,
              f: 0,
              p: 0,
              north: room.northBoundary.allowsSound,
              east: room.eastBoundary.allowsSound,
              south: room.southBoundary.allowsSound,
              west: room.westBoundary.allowsSound,
              square: square.id.toString(),
              id: Number(square.id) -1
            }
            nodeList.push(node);
          }
          
        }
      });
    });

    //work out manhatten distance
    nodeList.forEach(function(node, i){
      let n = i;
      while(n % 7 !== target % 7){
        if(n % 7 > target % 7){
          n = n - 1;
        } else if (n % 7 < target % 7){
          n = n + 1;
        }
        node.h = node.h + 1;
      }

      while(n !== target){
        if(n > target){
          n = n - 7;
        } else if(n < target){
          n = n + 7;
        }
        node.h = node.h + 1;
      }
    });

    //do algorithm
    let mg = 1;

    nodeList.forEach(function(node, i){
      if(i === origin){
        closedList.push(node);
      }
    });   
    
    let parents = this.getParents(nodeList, origin);
    nodeList.forEach(function(node, i){
      parents.forEach(function(parent){
        if(node === parent){
          node.p =  nodeList[origin];
          node.g = nodeList[origin].g + mg;
          node.f = node.g + node.h;
          openList.push(node);
        }
      });
    }); 

    let shortestNode = {
      f: 1000,
      g: 0,
      id: 0
    };
    let foundTarget = false;
    let counter = 0;

    while(foundTarget === false){
      shortestNode = {
        f: 1000,
        g: 0,
        id: 0
      };

      openList.forEach(function(node, i){
        if(node.f < shortestNode.f){
          shortestNode = node;
        }
      });
  
      nodeList.forEach(function(node, i){
        if(node === shortestNode){
          openList = openList.filter(function(node){
            return node !== shortestNode;
          });
          closedList.push(node);
  
          parents = ctrl.getParents(nodeList, i);
        }
      });

      parents.forEach(function(parent){
        if(parent !== null){
          if(parent.id === target || counter > 50){
            foundTarget = true;
            
            nodeList.forEach(function(node){
              if(node.id === target){
                node.p = shortestNode;
                node.g = shortestNode.g + mg;
              }
            });
            console.log('done');
          }
        }
      });
  
      if(!foundTarget){
        parents.forEach(function(parentNode){
          if(ctrl.onList(parentNode, closedList) === false){
            if(ctrl.onList(parentNode, openList)){
              if(shortestNode.g + mg < parentNode.g){
                parentNode.p = shortestNode;
              }
            } else {
              parentNode.p = shortestNode;
              parentNode.g = shortestNode.g + mg;
              parentNode.f = parentNode.g + parentNode.h;
              openList.push(parentNode);
            }
          }
        });
      }
      
      counter++;
    }

    nodeList.forEach(function(node){
      if(node.p !== 0){
        console.log('node : ' + node.id + ', g : ' + node.g + ' - parent : ' + node.p.id + ', g :' + node.p.g);
      }
    });

    //console.log(shortestNode);
    //console.log(parents);
    //console.log(parentals);
    //console.log(openList);
    //console.log(closedList);
    //console.log(nodeList);

    return route;
  }

  getParents(nodeList, origin): any{
    let parents = [];

    nodeList.forEach(function(node, i){
      
      if(origin - 7 > -1){
        if(origin - 7 === i){
          parents.push(node);
        }
      }

      if(origin % 7 !== 6){
        if(origin + 1 === i){
          parents.push(node);
        }
      }

      if(origin + 7 < 49){
        if(origin + 7 === i){
          parents.push(node);
        }
      }

      if(origin % 7 !== 0){
        if(origin - 1 === i){
          parents.push(node);
        }
      }
    });

    return parents;
  }

  onList(node, list): any{
    let bool = false;

    list.forEach(function(n){
      if(n === node){
        bool = true;
      }
    });

    return bool;
  }
}
