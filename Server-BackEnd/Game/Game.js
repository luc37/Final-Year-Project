const database = require('../database/connect-database');

const room = require('../Locations/Room');
const map = require('../Game/Map');
const sound = require('../Game/Sound');
const action = require('../Game/Action');

const mapHeight = 10;
const mapWidth = 10;

const game = {
    build: function(startRoomId){
        this.startRoomId = startRoomId;
    },
    setUp: function(theGame, socket, io){
        const ctrl = this;

        theMap = Object.create(map);
        theMap.build(theGame, mapWidth, mapHeight);

        socket.on('colour ui map', function(){
            io.sockets.emit('colour ui map', theGame.map);
        });

        socket.on('look direction', function(data){
            socket.emit('colour ui map', theGame.map);
        });

        socket.on('move to room', function(d){
            theGame.buildRoom(d.character, socket, io);
        });

        socket.on('made a sound', function(theSound){
            newSound = Object.create(sound);
            newSound.build(theSound.loudness, theSound.length, theSound.originId);

            theGame.addSound(newSound);
            io.emit('update sounds', theGame.sounds);
        });

        socket.on('toggle lights', function(d){
            let circ;
            theGame.map.forEach(function(room){
                if(d.character.roomId === room.id){
                    room = d.room;
                    circ = room.circuit;
                    room.lights.forEach(function(light){
                        if(light.hasOwnProperty("circuit")){
                            if(room.lit){
                                light.status = 'ON';
                            } else{
                                light.status = 'OFF';
                            }
                            let query = 'UPDATE lights set status = \'' + light.status + '\' where id = '+ light.id;
                            database.connection.query( query, function(err, result){
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });

            theGame.map.forEach(function(room){
               if(room.circuit === circ){
                    room.lit = !room.lit;
                }
            });

            io.sockets.emit('colour ui map', theGame.map);

        });

        socket.on('switch tabs', function(character){
            theGame.activePlayerList.forEach(element => {
    
                if(element.id === character.id){
                    element.socketId = socket.id;
                    
                    setUpPlayScreen(socket, io);
                    io.sockets.connected[character.socketId].disconnect();
    
                    theMap.build(theGame, mapWidth, mapHeight);
                    theGame.buildRoom(character, socket, io);
                }
    
                socket.emit('new socket', socket.id);
            });
        });

        socket.on('resetPlayScreenPage', function(character){
            theGame.addPlayerToActivePlayerList(character);
            theGame.intoduceNewPlayer(socket);
            setUpPlayScreen(socket, io);
    
            io.emit('set up player list', theGame.activePlayerList);
    
            theGame.buildRoom(character, socket, io);
        });

        socket.on('update additional info', function(object){

            if(object.socketCall === 'move to room'){
                socket.broadcast.emit('update additional info', object);
            } else if(object.socketCall === 'shoot target'){
                socket.broadcast.emit('update additional info', object);
            } else{
                object.text = 'different socket call'
                socket.broadcast.emit('update additional info', object);
            }
        });

        socket.on('pick up item', function(data){
            let theItemPickedUpIndex;
            let theItemPickedUp;
            theGame.map.forEach(function(room){
                if(room.id === data.room.id){
                    room.objects.forEach(function(item, i){
                        if(item.id === data.itemPickedUp.id){
                            item.pickUpStatus = 'picked up';
                            theItemPickedUpIndex = i;
                            theItemPickedUp = item;
                        }
                    });
                    room.objects.splice(theItemPickedUpIndex,1);
                    data.roomList.forEach(function(player){
                        socket.to(player.socketId).emit('the room', room);
                    });
                    socket.emit('the room', room);

                    let query = 'update items set roomId = 0, status=\'' + theItemPickedUp.status + '\' where id=' +theItemPickedUp.id;
                    database.connection.query(query, function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                    database.connection.query('select * from inventory where characterId = ' + data.character.id, function(err, rows){
                        if(err){
                            console.log(err);
                        } else {
                            let itemId = -1;
                            let field;
                            if(rows[0].itemId1 === null){
                                itemId =  theItemPickedUp.id;
                                field = 'itemId1';
                            } else if (rows[0].itemId2 === null){
                                itemId =  theItemPickedUp.id;
                                field = 'itemId2';
                            } else if (rows[0].itemId3 === null){
                                itemId =  theItemPickedUp.id;
                                field = 'itemId3';
                            }

                            if(itemId !== -1){
                                database.connection.query('update inventory set ' + field + '= ' + itemId + ' where id = ' +  rows[0].id, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
        socket.on('drop item', function(data){
            let theItemDropped;
            let theItemDroppedIndex;

            theGame.map.forEach(function(room){
                if(room.id === data.room.id){
                    data.character.inventory.forEach(function(item, i){
                        if(item.id === data.itemDropped.id){
                            item.pickUpStatus = 'dropped';
                            theItemDropped = item;
                            theItemDroppedIndex = i;
                        }
                    });

                    data.character.inventory.splice(theItemDroppedIndex,1);
                    socket.emit('update inventory', data.character.inventory);                    

                    room.objects.push(theItemDropped);
                    data.roomList.forEach(function(player){
                        socket.to(player.socketId).emit('the room', room);
                    });
                    socket.emit('the room', room);

                    let query = 'update items set roomId = '+ room.id +', status=\'' + theItemDropped.status + '\' where id=' +theItemDropped.id;
                    database.connection.query(query, function(err){
                        if(err){
                            console.log(err);
                        }
                    });

                    database.connection.query('select * from inventory where characterId = ' + data.character.id, function(err, rows){
                        if(err){
                            console.log(err);
                        } else {
                            let itemId = -1;
                            let field;
                            if(rows[0].itemId1 === theItemDropped.id){
                                itemId = rows[0].itemId1;
                                field = 'itemId1';
                            } else if (rows[0].itemId2 === theItemDropped.id){
                                itemId = rows[0].itemId1;
                                field = 'itemId2';
                            } else if (rows[0].itemId3 === theItemDropped.id){
                                itemId = rows[0].itemId1;
                                field = 'itemId3';
                            }

                            if(itemId !== -1){
                                database.connection.query('update inventory set ' + field + '= null where id = ' +  rows[0].id, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });

        socket.on('turn item on', function(data){
            console.log(data);

            //create a new sound - update sounds
            //update map and send - colour ui map
        });

        socket.on('turn item off', function(data){
            console.log(data);

            //create a new sound - update sounds
            //update map and send - colour ui map
        });

        socket.on('search item', function(data){
            let q1 = 'update user set bullets = ' + data.character.bullets;
            let q2 = ' where characterId = ' + data.character.id;
            database.connection.query(q1+q2, function(err){
                if(err){
                    console.log(err);
                }
            });
        });

        socket.on('eat item', function(data){
            let q1 = 'update user set health = ' + data.character.health;
            let q2 = ', clumsiness = ' + data.character.clumsiness;
            let q3 = ', smell = ' + data.character.smell;
            let q4 = ' where characterId = ' + data.character.id;
            database.connection.query(q1+q2+q3+q4, function(err){
                if(err){
                    console.log(err);
                }
            });
        });

        socket.on('shoot target', function(data){
            let q1 = 'update user set bullets = ' + data.character.bullets;
            let q2 = ' where characterId = ' + data.character.id;
            database.connection.query(q1+q2, function(err){
                if(err){
                    console.log(err);
                }
            });
        });

        socket.on('been shot', function(character){
            let q1 = 'update user set health = ' + character.health;
            let q2 = ', clumsiness = ' + character.clumsiness;
            let q3 = ' where characterId = ' + character.id;
            database.connection.query(q1+q2+q3, function(err){
                if(err){
                    console.log(err);
                }
            });
        });

        socket.on('update actions', function(theAction){
            let anAction = Object.create(action);
            anAction.build( theAction.command.executionTime, theAction.command.executingText, 
                            theAction.command.completedText, theAction.instigator, theAction.target, 
                            theAction.command);
            
            theGame.addAction(anAction);
            io.emit('update actions', theGame.actionsList);
        });

        socket.on('disconnect', function () {
            theGame.removePlayerFromActivePlayerList(socket.id);
            io.emit('connection count', getClientCount(io));
            io.emit('player list', theGame.activePlayerList);
            io.emit('update room lists', null);
            io.emit('colour ui map', theGame.map);
        });
    },
    addPlayerToActivePlayerList: function(character){
        this.activePlayerList.push(character);
    },
    removePlayerFromActivePlayerList: function(socketId){
        playerListClone = this.activePlayerList;
        this.activePlayerList = [];

        for(let i = 0; i < playerListClone.length; i++){
            if(playerListClone[i].socketId === socketId){
                
            } else{
                this.activePlayerList.push(playerListClone[i]);
            }
        }
    },
    run: function(io){
        let ctrl = this;

        if( ctrl.smellTime > ctrl.updateTime){
            ctrl.smellTime = 0;
            database.connection.query('select * from user', function(err, rows){
                if(err){
                    console.log(err);
                } else {
                    rows.forEach(function(character){
                        if(character.smell > 0){
                            character.smell = character.smell - 1;
                            database.connection.query('update user set smell = ' + character.smell + ' where characterId = ' + character.characterId, function(err){
                                if(err){
                                    console.log(err);
                                }
                            });
                        }

                        ctrl.activePlayerList.forEach(function(c, i){
                            if(character.characterId === c.id){
                                c.smell = character.smell;
                            }
                        });
                        io.emit('update smells', ctrl.activePlayerList);
                    });
                }
            });
        }
        ctrl.smellTime = ctrl.smellTime + 100

        this.sounds.forEach(function(sound, i){
            if(sound.length <= 0){
                ctrl.removeSound(i);
                io.emit('update sounds', ctrl.sounds);
            } else{
                sound.length = sound.length -1;
            }
        });

        this.actionsList.forEach(function(action, i){
            if(action.time <= 0){
                ctrl.removeAction(i);
                io.emit('update actions', ctrl.actionsList);
                io.emit('action completed', action);
            } else{
                action.time = action.time -1;
            }
        });

        io.emit('updateGame', 'update game');
    },
    intoduceNewPlayer: function(socket){
        socket.emit('updateGame', 'Welcome to the Game...');
    },
    buildRoom: function(character, socket, io){
        const ctrl = this;

        let theRoom = Object.create(room);
        let destId, face;

        if(character.roomId === null){
            destId = this.startRoomId;
        }else{
            destId = character.roomId;
        }

        if(character.lookDirection === null){
            face = "north";
        }else{
            face = character.lookDirection;
        }

        let query = 'UPDATE user set roomId = ' + destId + ', lookDirection = \''+ face  +'\' where characterId = '+ character.id;
        database.connection.query( query, function(err, result){
            if(err){
                console.log(err);
            }else{}
        });

        database.connection.query('SELECT * from room where id = ' + destId + ' limit 1', function(err, rows){
            if(err){
                console.log(err);
            }else{

                theRoom.build(rows[0]);

                database.connection.query('select * from boundary where id = ' + theRoom.northBoundary, function(err, rows){
                    if(err){
                        console.log(err);
                    }else{
                        theRoom.getBoundary(rows[0] ,'n');
                    }
                });

                database.connection.query('select * from boundary where id = ' + theRoom.eastBoundary, function(err, rows){
                    if(err){
                        console.log(err);
                    }else{
                        theRoom.getBoundary(rows[0] ,'e');
                    }
                });

                database.connection.query('select * from boundary where id = ' + theRoom.southBoundary, function(err, rows){
                    if(err){
                        console.log(err);
                    }else{
                        theRoom.getBoundary(rows[0] ,'s');
                    }
                });

                database.connection.query('select * from boundary where id = ' + theRoom.westBoundary, function(err, rows){
                    if(err){
                        console.log(err);
                    }else{
                        theRoom.getBoundary(rows[0] ,'w');
                        
                        database.connection.query('select * from lights where circuit = ' + theRoom.circuit, function(err, rows){
                            if(err){
                                console.log(err);
                            }else{
                                if(rows.length > 0){
                                    ctrl.map.forEach(function(room){
                                        if(room.circuit === theRoom.circuit){
                                            if(rows[0].status === 'ON'){
                                                room.lit = true;
                                            } else if(rows[0].status === 'OFF') {
                                                room.lit = false;
                                            }
                                        }
                                        if(room.id === theRoom.id){
                                            theRoom.setLights(room.lights);
                                            theRoom.lit = room.lit;
                                        }
                                    });
                                }

                                ctrl.map.forEach(function(room){
                                    if(room.id === theRoom.id){
                                        theRoom.setObjects(room.objects);
                                    }
                                });

                                theRoom.addExits(theRoom.getExits(theRoom, mapWidth, mapHeight));
                                socket.emit('the room', theRoom);

                                ctrl.activePlayerList.forEach(char =>{
                                    if(char.id === character.id){
                                        char.roomId = character.roomId;
                                    }
                                });
                                
                                io.emit('player list', ctrl.activePlayerList);
                            }
                        });
                    }
                });
            }
        });
    },
    buildArea: function(){

    },
    addSound: function(sound){
        this.sounds.push(sound);
    },
    removeSound: function(i){
        this.sounds.splice(i, 1);
    },
    addAction: function(action){
        this.actionsList.push(action);
    },
    removeAction: function(i){
        this.actionsList.splice(i,1);
    },
    startRoomId: 0,
    activePlayerList:[],
    map:[],
    sounds:[],
    actionsList: [],
    smellTime: 100,
    updateTime: 1000
}

function setUpPlayScreen(socket, io){
	io.emit('connection count', getClientCount(io));
	//io.emit('player list', theGame.activePlayerList);

	socket.on('to server', function(data) {
		socket.broadcast.emit('from server', data);
	});

	socket.on('update room lists', function() {
		io.emit('update room lists', null);
	});
}

function getClientCount(io){
	clients = io.sockets.clients();

	let count = 0;
	for(let o in clients.connected){
		count++;
	}
	
	return count;
}

module.exports = game;