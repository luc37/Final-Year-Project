const aStarSearch = {
    findRoute: function(origin, target, map){
        const ctrl = this;
            let route = {
              route: [target],
              distance: 0,
            };

            let openList = [];
            let closedList = [];
        
            let nodeList = [];
        
            if(origin === target){
              return route;
            }
        
            map.forEach(room => {

                let known = [];
                
                let node = {
                h: 0,
                g: 0,
                f: 0,
                p: 0,
                north: room.northBoundary.allowsAccess,
                east: room.eastBoundary.allowsAccess,
                south: room.southBoundary.allowsAccess,
                west: room.westBoundary.allowsAccess,
                id: room.id -1
                }
                nodeList.push(node);
              });
        
            //work out manhatten distance
            nodeList.forEach(function(node, i){
              let n = i;
              while(n % 10 !== target % 10){
                if(n % 10 > target % 10){
                  n = n - 1;
                } else if (n % 10 < target % 10){
                  n = n + 1;
                }
                node.h = node.h + 1;
              }
        
              while(n !== target){
                if(n > target){
                  n = n - 10;
                } else if(n < target){
                  n = n + 10;
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
            
            let parents = ctrl.getParents(nodeList, origin);
            //console.log('length : ' + parents.length);
            if(parents.length === 0){
              return 'no path';
            }
        
            let shortestNode = {
              f: 1000,
              g: 0,
              id: 0
            };
            let foundTarget = false;
            let noPath = false;
            let counter = 0;
        
            //first time check
            parents.forEach(function(parent){
              if(parent !== null){
                if(parent.id === target){
                  foundTarget = true;
        
                  nodeList[target].p = nodeList[origin];
                  nodeList[target].g = 1;
                }
              }
            });
        
            if(!foundTarget){
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
            }
        
            while(foundTarget === false){
              shortestNode = {
                f: 1000,
                g: 0,
                id: 0
              };
        
              openList.forEach(function(node, i){
                if(node.f < shortestNode.f){
                  shortestNode = node;
                  //console.log('short node set');
                  //console.log(shortestNode.id);
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
                  if(parent.id === target || counter > 2000){
                    foundTarget = true;
                    
                    nodeList.forEach(function(node){
                      if(node.id === target){
                        node.p = shortestNode;
                        node.g = shortestNode.g + mg;
                      }
                    });
                    
                    if(counter < 2000){
                      //console.log('done');
                    } else {
                      noPath = true;
                      //console.log('reached : ' + counter);
                    }
                    
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
        
            if(!noPath){
              nodeList.forEach(function(node){
                if(node.p !== 0){
                  //console.log('node : ' + node.id + ', g : ' + node.g + ' - parent : ' + node.p.id + ', g :' + node.p.g);
                }
              });
          
              nodeList.forEach(function(node){
                if(node.id === target){
                  route.distance = node.g;
                  ctrl.getRoute(route, target, nodeList, origin);
                }
              });
            }
            
            if(!noPath){
                return route;
            } else {
                return 'no path';
            }
    },
    getRoute: function(route, target, nodeList, origin){
        const ctrl = this;
        let parent;
    
        nodeList.forEach(function(node){
          if(node.id === target){
            route.route.unshift(node.p.id);
            parent = node.p.id;
          }
        });
    
        if(parent !== origin){
          nodeList.forEach(function(node){
            if(node.id === parent){
              ctrl.getRoute(route, parent, nodeList, origin);
            }
          });
        }
      },
      getParents: function(nodeList, origin){
        let parents = [];
        let selectedNode;

        nodeList.forEach(node => {
          if(origin === node.id){
            selectedNode = node;
          }
        });
    
        nodeList.forEach(function(node, i){
          if(selectedNode !== undefined){
            if(origin - 10 > -1){
              if(origin - 10 === i){
                if(selectedNode.north === 1 && node.south === 1){
                  parents.push(node);
                }
              }
            }
      
            if(origin % 10 !== 9){
              if(origin + 1 === i){
                if(selectedNode.east === 1 && node.west === 1){
                  parents.push(node);
                }
              }
            }
      
            if(origin + 10 < 100){
              if(origin + 10 === i){
                if(selectedNode.south === 1 && node.north === 1){
                  parents.push(node);
                }
              }
            }
      
            if(origin % 10 !== 0){
              if(origin - 1 === i){
                if(selectedNode.west === 1 && node.east === 1){
                  parents.push(node);
                }
              }
            }
          }
        });

        return parents;
      },
      onList: function(node, list){
        let bool = false;
    
        list.forEach(function(n){
          if(n === node){
            bool = true;
          }
        });
    
        return bool;
      }

}

module.exports = aStarSearch;