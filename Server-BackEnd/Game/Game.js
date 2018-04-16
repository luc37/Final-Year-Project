const database = require('../database/connect-database');

const room = require('../Locations/Room');
const map = require('../Game/Map');
const sound = require('../Game/Sound');
const action = require('../Game/Action');
const outlaw = require('../Character/Outlaw');
const overlord = require('../Character/Overlord');

const search = require('../AStarSearch');

const mapHeight = 10;
const mapWidth = 10;

const game = {
    build: function(startRoomId, io){
        this.startRoomId = startRoomId;
        this.io = io;
    },
    setUp: function(theGame, socket, io){
        const ctrl = this;

        let theMap = Object.create(map);
        theMap.build(theGame, mapWidth, mapHeight, false);

        socket.on('reset game', function(){
            ctrl.resetGame(theGame, theGame.io);
        });

        socket.on('colour ui map', function(){
            io.sockets.emit('colour ui map', theGame.gameMap);
        });

        socket.on('look direction', function(data){
            socket.emit('colour ui map', theGame.gameMap);
        });

        socket.on('move to room', function(d){
            theGame.buildRoom(d.character, socket, io);
        });

        socket.on('made a sound', function(theSound){
            createSound(theSound, theGame, io);
        });

        socket.on('toggle lights', function(d){
            toggleLights(d, theGame, io);
        });

        socket.on('switch tabs', function(character){
            switchTabs(character, theGame, io, theMap, socket);
        });

        socket.on('resetPlayScreenPage', function(character){
            resetPlayScreenPage(character, theGame, io, socket);
        });

        socket.on('update additional info', function(object){
            updateAdditionalInfo(object, socket);
        });

        socket.on('pick up item', function(data){
            pickUpItem(data, theGame, socket);
        });

        socket.on('drop item', function(data){
            dropItem(data, theGame, socket);
        });

        socket.on('check hiding', function(data){
            if(data.command.loudness > Math.floor(Math.random() * 6) + 0 || data.command.socketCall === 'move to room'){
                theGame.activePlayerList.forEach(function(character){
                    if(data.character.id === character.id){
                        character.hiding = false;
                    }
                });

                io.emit('player list', theGame.activePlayerList.concat(theGame.outlawsList));
                io.emit('update room lists', null);
                socket.emit('colour ui map', theGame.gameMap);
            }
        });

        socket.on('hide somewhere', function(data){
            theGame.activePlayerList.forEach(function(character){
                if(data.character.id === character.id){
                    character.hiding = true;
                    socket.emit('colour ui map', theGame.gameMap);
                }
            });

            io.emit('player list', theGame.activePlayerList.concat(theGame.outlawsList));
            io.emit('update room lists', null);
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
            if(data.foundBomb !== true){
                searchItem(data);
            } else {
                theGame.gameMap.forEach(function(room){
                    if(room.id === theGame.bomb.roomId){
                        room.objects.forEach(function(o){
                            if(o.name === 'Bomb'){
                                o.visible = true;
                            }
                        });
                    }
                });
            }
        });

        socket.on('eat item', function(data){
            eatItem(data);
        });

        socket.on('shoot target', function(data){
            shootTarget(data);
        });

        socket.on('been shot', function(character){
            beenShot(character, theGame, socket);
        });

        socket.on('detonate bomb', function(data){
            theGame.bomb.status = 'going off';
            theGame.bomb.roomId = data.character.roomId;
        });

        socket.on('update actions', function(theAction){
            updateActions(theAction, theGame, io);
        });

        socket.on('disconnect', function () {
            theGame.removePlayerFromActivePlayerList(socket.id);
            io.emit('connection count', getClientCount(io));
            io.emit('player list', theGame.activePlayerList.concat(theGame.outlawsList));
            io.emit('update room lists', null);
            io.emit('colour ui map', theGame.gameMap);
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
    setUpOverlord: function(){
        let theOverlord = Object.create(overlord);

        let overlordData = {
            characterName: 'Overlord',
            characterId: 2000,
            roomId: 44,
            lookDirection: 'north',
            smell: 0,
            health: 10,
            bullets: 20,
            gunPower: 5,
            aim: 2,
            clumsiness: 2,
            maxhealth: 12
        }

        theOverlord.build(overlordData, false, null);
        theOverlord.updateStatus('hide');
        this.overlord = theOverlord;
        this.outlawsList.push(theOverlord);
    },
    setUpOutlaws: function(amount){
        for(let i = 0; i < amount; i++){
            let anOutlaw = Object.create(outlaw);
            
            let outlawData = {
                characterName: 'Outlaw Bandit ' + i,
                characterId: 1000 + i,
                roomId: 24,
                lookDirection: 'north',
                smell: 2,
                health: 10,
                bullets: 20,
                gunPower: 5,
                aim: 2,
                clumsiness: 2,
                maxhealth: 12
            }

            anOutlaw.build(outlawData, false, null);
            anOutlaw.updateStatus('start patrol');
            this.outlawsList.push(anOutlaw);
        }
    },
    run: function(io){
        let ctrl = this;

        if( ctrl.smellTime > ctrl.updateTime){
            updateSmells(ctrl);
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

        this.outlawsList.forEach(function(outlaw, j){
            outlaw.waitTime = outlaw.waitTime + 200;
            //console.log(outlaw.name + ' : ' + outlaw.status + ' : ' + outlaw.roomId);

            if(outlaw.status === 'on patrol' && outlaw.executingCommand === false){
                let target, heardSomething = false, targetLoudness;
                ctrl.sounds.forEach(function(sound){
                    let route = search.findRoute(outlaw.roomId, sound.originId, ctrl.gameMap);

                    if(sound.loudness > route.distance && sound.loudness > Math.floor(Math.random() * 10) + 1){
                        if(outlaw.name !== 'Overlord'){
                            targetLoudness = sound.loudness;
                            if(sound.loudness > targetLoudness){
                                target = sound.originId;
                                outlaw.status = 'hunting';
                                heardSomething = true;
                            }
                            
                        }
                    }
                });
                
                if(heardSomething){
                    outlawStartPatrol(outlaw, ctrl, target);
                } else{
                    outlawOnPatrol(outlaw);
                }
            }

            if(outlaw.status === 'start patrol'){
                outlawStartPatrol(outlaw, ctrl, Math.floor(Math.random() * 100) + 1);
            }

            if(outlaw.name === 'Overlord'  && outlaw.executingCommand === false){
                outlawStartPatrol(outlaw, ctrl, Math.floor(Math.random() * 100) + 1);
            }

            if(outlaw.executingCommand === true){
                outlawExecuteCommand(outlaw, ctrl);
            }
            
            if(outlaw.waitTime > ctrl.updateTime*4){
                outlaw.waitTime = 0;

                if(outlaw.status === 'waiting'){
                    outlaw.status = 'start patrol';
                }
            }

            ctrl.actionsList.forEach(function(action, i){
                if(action.target === outlaw.name){
                    if(action.time <= 0){
                        outlaw.health = outlaw.health -2;

                        if(outlaw.name === 'Overlord' && outlaw.health <=0){
                            ctrl.winner = action.instigator;
                        }
                    }
                }
            });

            if(outlaw.health <= 0){
                outlaw.status = 'dead';
                if(outlaw.name === 'Overlord'){
                    ctrl.resetGame(ctrl, ctrl.io);
                }
                ctrl.outlawsList.splice(j, 1);
            }
        });

        if(ctrl.bomb.status === 'going off'){
            if(ctrl.bomb.timer > 0){
                ctrl.bomb.timer = ctrl.bomb.timer - 1;
                io.emit('bomb going off', ctrl.bomb.timer);
            } else{
                io.emit('bomb exploded', ctrl.bomb)
                ctrl.bomb.timer = 10;
                ctrl.bomb.status = 'blown up';
                explosion(ctrl);
            }
            
        }

        io.emit('updateGame', 'update game');
    },
    intoduceNewPlayer: function(socket){
        socket.emit('updateGame', 'Welcome to the Game... find and defeat the overlord');
    },
    buildRoom: function(character, socket, io){
        const ctrl = this;
        buildRoom(character, socket, io, ctrl);
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
    resetGame(theGame, io){
        console.log('game won');

        io.emit('game won', theGame.winner + ' defeated the overlord!');

        let lastGame = theGame;
        theGame = null;
        theGame = Object.create(game);
		theGame.build(lastGame.startRoomId, io);

		let theMap = Object.create(map);
        theMap.build(theGame, mapWidth, mapHeight, true);

        theGame.outlawsList = [];

		theGame.setUpOutlaws(5);
        theGame.setUpOverlord();

        theGame.activePlayerList = lastGame.activePlayerList;

        theGame.activePlayerList.forEach(function(character){
            dieAndRespawn(character, theGame, io.to(character.socketId));
        });
        
    },
    startRoomId: 0,
    activePlayerList:[],
    gameMap:[],
    sounds:[],
    actionsList: [],
    smellTime: 100,
    updateTime: 1000,
    outlawsList: [],
    io: {},
    AiTime: 200,
    overlord: {},
    winner: 'no one',
    bomb: {}
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

function updateActions(theAction, theGame, io){
    let anAction = Object.create(action);
    anAction.build( theAction.command.executionTime, theAction.command.executingText, 
                    theAction.command.completedText, theAction.instigator, theAction.target, 
                    theAction.command);
            
    theGame.addAction(anAction);
    io.emit('update actions', theGame.actionsList);
}

function outlawOnPatrol(outlaw){
    if(outlaw.route.route.length !== 0){
        outlaw.lastRoom = outlaw.route.route.shift();

        if(outlaw.lastRoom === outlaw.roomId - 10){
            outlaw.commandList.list.forEach(function(com){
                if(com.name === 'Walk north'){
                    outlaw.command = com;
                    outlaw.lookDirection = 'north';
                }
            });
        } else if(outlaw.lastRoom === outlaw.roomId + 10){
            outlaw.commandList.list.forEach(function(com){
                if(com.name === 'Walk south'){
                    outlaw.command = com;
                    outlaw.lookDirection = 'south';
                }
            });
        }else if(outlaw.lastRoom === outlaw.roomId - 1){
            outlaw.commandList.list.forEach(function(com){
                if(com.name === 'Walk west'){
                    outlaw.command = com;
                    outlaw.lookDirection = 'west';
                }
            });
        }else if(outlaw.lastRoom === outlaw.roomId + 1){
            outlaw.commandList.list.forEach(function(com){
                if(com.name === 'Walk east'){
                    outlaw.command = com;
                    outlaw.lookDirection = 'east';
                }
            });
        }
        outlaw.executingCommand = true;
    }    
}

function outlawStartPatrol(outlaw, ctrl, t){
    let roomOfOutlaw = outlaw.roomId;
    let roomOfInterest = t;

    let origin = roomOfOutlaw -1;
    let target = roomOfInterest -1;
    let newRoute = [];

    let route = search.findRoute(origin, target, ctrl.gameMap);
    if(route !== 'no path'){
        route.route.forEach(function(n){
            newRoute.push(n +1);
        });
        route.route = newRoute;

        outlaw.updateRoute(route);
        outlaw.updateStatus('on patrol');
    }
}

function outlawExecuteCommand(outlaw, ctrl){
    //console.log('executing command');
    if(outlaw.command.target === undefined){
        outlaw.command.target = '';
    }

    if(outlaw.command.status === undefined){
        outlaw.command.status = '';
    }

    if(outlaw.command.executingTime > 0){
        outlaw.command.executingTime = outlaw.command.executingTime -1;

        if(outlaw.command.executionTime === outlaw.command.executingTime+1){
            let aSound = {
            loudness: outlaw.command.loudness,
            length: outlaw.command.executionTime,
            originId: outlaw.roomId
            }
            outlaw.sound = aSound.loudness;

            if(aSound.loudness > 0){
            createSound(aSound, ctrl, ctrl.io);
            }
            //ctrl.socket.emit('update actions', {command: command, instigator: outlaw.name, target: command.target});
            updateActions({command: outlaw.command, instigator: outlaw.name, target: outlaw.command.target}, ctrl, ctrl.io);
        }

        }else{
        //console.log('completed command');
        if(outlaw.command.name === 'Eat'){
            if(outlaw.health < outlaw.maxHealth){
            outlaw.health = outlaw.health + 1;
            if(outlaw.clumsiness > 0){
                outlaw.clumsiness = outlaw.clumsiness - 1;
            }
            }
            outlaw.smell = outlaw.smell + 2;
        } else if(outlaw.command.name === 'Search'){
            outlaw.bullets = outlaw.bullets + 1;
        }
        
        if(outlaw.command.socketCall === 'move to room'){
            outlaw.roomId = outlaw.lastRoom;
            
            ctrl.io.emit('player list', ctrl.activePlayerList.concat(ctrl.outlawsList));
            ctrl.io.emit('colour ui map', ctrl.gameMap);
            ctrl.io.emit('update room lists', null);
        }

        outlaw.executingCommand = false;
        outlaw.command.executingTime = outlaw.command.executionTime;

        outlaw.sound = 0;

        if(outlaw.route.route.length === 0){
            outlaw.roomId = outlaw.lastRoom;
            outlaw.updateStatus('waiting');
        }
    }
}

function createSound(theSound, theGame, io){
    let newSound = Object.create(sound);
    newSound.build(theSound.loudness, theSound.length, theSound.originId);

    theGame.addSound(newSound);
    io.emit('update sounds', theGame.sounds);
}

function toggleLights(d, theGame, io){
    let circ;
    theGame.gameMap.forEach(function(room){
        if(d.character.roomId === room.id){
            circ = room.circuit;
            room.lights.forEach(function(light){
                if(light.hasOwnProperty("circuit")){
                    if(room.lit){
                        light.status = 'OFF';
                    } else{
                        light.status = 'ON';
                    }
                    console.log('after : ' + light.status);
                    let query = 'UPDATE lights set status = \'' + light.status + '\' where id = '+ light.id;
                    database.connection.query( query, function(err, result){
                        if(err){
                            console.log(err);
                        }else{
                            //console.log(result);
                        }
                    });
                }
            });
        }
    });

    theGame.gameMap.forEach(function(room){
        if(room.circuit === circ){
            room.lit = !room.lit;
        }
    });

    io.sockets.emit('colour ui map', theGame.gameMap);
}

function switchTabs(character, theGame, io, theMap, socket){
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
}

function resetPlayScreenPage(character, theGame, io, socket){
    theGame.addPlayerToActivePlayerList(character);
    theGame.intoduceNewPlayer(socket);
    setUpPlayScreen(socket, io);

    io.emit('set up player list', theGame.activePlayerList.concat(theGame.outlawsList));

    theGame.buildRoom(character, socket, io);
}

function updateAdditionalInfo(object, socket){
    if(object.socketCall === 'move to room'){
        socket.broadcast.emit('update additional info', object);
    } else if(object.socketCall === 'shoot target'){
        socket.broadcast.emit('update additional info', object);
    } else{
        object.text = 'different socket call'
        socket.broadcast.emit('update additional info', object);
    }
}

function pickUpItem(data, theGame, socket){
    let theItemPickedUpIndex;
    let theItemPickedUp;
    theGame.gameMap.forEach(function(room){
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

            let query = 'update items set roomId = 0, pickUpStatus=\'' + theItemPickedUp.pickUpStatus + '\' where id=' +theItemPickedUp.id;
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
}

function dropItem(data, theGame, socket){
    let theItemDropped;
    let theItemDroppedIndex;

    theGame.gameMap.forEach(function(room){
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

            let query = 'update items set roomId = '+ room.id +', pickUpStatus=\'' + theItemDropped.pickUpStatus + '\' where id=' +theItemDropped.id;
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
}

function searchItem(data){
    let q1 = 'update user set bullets = ' + data.character.bullets;
            let q2 = ' where characterId = ' + data.character.id;
            database.connection.query(q1+q2, function(err){
                if(err){
                    console.log(err);
                }
            });
}

function eatItem(data){
    let q1 = 'update user set health = ' + data.character.health;
    let q2 = ', clumsiness = ' + data.character.clumsiness;
    let q3 = ', smell = ' + data.character.smell;
    let q4 = ' where characterId = ' + data.character.id;
    database.connection.query(q1+q2+q3+q4, function(err){
        if(err){
            console.log(err);
        }
    });
}

function shootTarget(data){
    let q1 = 'update user set bullets = ' + data.character.bullets;
            let q2 = ' where characterId = ' + data.character.id;
            database.connection.query(q1+q2, function(err){
                if(err){
                    console.log(err);
                }
            });
}

function beenShot(character, theGame, socket){
    let q1 = 'update user set health = ' + character.health;
    let q2 = ', clumsiness = ' + character.clumsiness;
    let q3 = ' where characterId = ' + character.id;
    database.connection.query(q1+q2+q3, function(err){
        if(err){
            console.log(err);
        }
    });
    
    if(character.health <= 0){
        dieAndRespawn(character, theGame, socket);
    }
}

function dieAndRespawn(character, theGame, socket){
    character.roomId = theGame.startRoomId;
    character.health = 8;
    character.bullets = 8;
    character.clumsiness = 0;
    character.smell = 0;
    character.sound = 0;

    let q1 = 'update user set roomId = ' + character.roomId;
    let q2 = ', health = ' + 8;
    let q3 = ', bullets = ' + 8;
    let q4 = ', clumsiness = ' + 0;
    let q5 = ', smell = ' + 0;
    let q7 = ' where characterId = ' + character.id;
    database.connection.query(q1+q2+q3+q4+q5+q7, function(err){
        if(err){
            console.log(err);
        }
    });

    socket.emit('you died', {deadText:'You died... Respawned.', character:character});
    theGame.buildRoom(character, socket, theGame.io, theGame);
}

function updateSmells(ctrl){
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
                        ctrl.outlawsList.forEach(function(outlaw){
                            if(outlaw.smell > 0){
                                outlaw.smell = outlaw.smell - 1;
                            }
                        });
                        ctrl.io.emit('update smells', ctrl.activePlayerList.concat(ctrl.outlawsList));
                    });
                }
            });
}

function buildRoom(character, socket, io, ctrl){
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
                                    ctrl.gameMap.forEach(function(room){
                                        if(room.circuit === theRoom.circuit){
                                            if(rows[0].status === 'ON'){
                                                room.lit = true;
                                            } else if(rows[0].status === 'OFF') {
                                                room.lit = false;
                                            }
                                        }
                                        if(room.id === theRoom.id){
                                            console.log('builb room : ' + room.lit);
                                            theRoom.setLights(room.lights);
                                            theRoom.lit = room.lit;
                                        }
                                    });
                                }

                                ctrl.gameMap.forEach(function(room){
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
                                
                                io.emit('player list', ctrl.activePlayerList.concat(ctrl.outlawsList));
                            }
                        });
                    }
                });
            }
        });
}

function explosion(theGame){
    let northId, eastId, soutId, westId;
    explosionRooms = [];
    explosionRooms.push(theGame.bomb.roomId);
    if(theGame.bomb.roomId -10 > 0){
        northId = theGame.bomb.roomId -10;
        explosionRooms.push(northId);
    }

    if(theGame.bomb.roomId % 10 !== 0){
        eastId = theGame.bomb.roomId +1;
        explosionRooms.push(eastId);
    }

    if(theGame.bomb.roomId +10 < 101){
        southId = theGame.bomb.roomId +10;
        explosionRooms.push(southId);
    }

    if(theGame.bomb.roomId % 10  !== 1){
        westId = theGame.bomb.roomId -1;
        explosionRooms.push(westId);
    }

    console.log(explosionRooms)

    explosionRooms.forEach(function(rID){
        theGame.gameMap.forEach(function(room){
            if(room.id === rID){
                room.description = 'A pile of rubble.'
                room.northBoundary.allowsSound = 1;
                room.northBoundary.allowsVisibility = 1;
                room.northBoundary.allowsAccess = 1;
                room.northBoundary.allowsSmell = 1;

                room.eastBoundary.allowsSound = 1;
                room.eastBoundary.allowsVisibility = 1;
                room.eastBoundary.allowsAccess = 1;
                room.eastBoundary.allowsSmell = 1;

                room.southBoundary.allowsSound = 1;
                room.southBoundary.allowsVisibility = 1;
                room.southBoundary.allowsAccess = 1;
                room.southBoundary.allowsSmell = 1;

                room.westBoundary.allowsSound = 1;
                room.westBoundary.allowsVisibility = 1;
                room.westBoundary.allowsAccess = 1;
                room.westBoundary.allowsSmell = 1;

                room.objects = [];
            
                let q10 = 'update room set description = \'' + room.description;
                let q11 = '\' where id = ' + room.id;
                database.connection.query(q10+q11, function(err){
                    if(err){
                        console.log(err);
                    }
                });

                let q1 = 'update boundary set allowsSound = ' + room.northBoundary.allowsSound;
                let q2 = ', allowsVisibility = ' + room.northBoundary.allowsVisibility;
                let q3 = ', allowsAccess = ' + room.northBoundary.allowsAccess;
                let q4 = ', allowsSmell = ' + room.northBoundary.allowsSmell;
                let q5 = ' where id = ' + room.northBoundary.id;
                database.connection.query(q1+q2+q3+q4+q5, function(err){
                    if(err){
                        console.log(err);
                    }
                });

                q1 = 'update boundary set allowsSound = ' + room.eastBoundary.allowsSound;
                q2 = ', allowsVisibility = ' + room.eastBoundary.allowsVisibility;
                q3 = ', allowsAccess = ' + room.eastBoundary.allowsAccess;
                q4 = ', allowsSmell = ' + room.eastBoundary.allowsSmell;
                q5 = ' where id = ' + room.eastBoundary.id;
                database.connection.query(q1+q2+q3+q4+q5, function(err){
                    if(err){
                        console.log(err);
                    }
                });

                q1 = 'update boundary set allowsSound = ' + room.southBoundary.allowsSound;
                q2 = ', allowsVisibility = ' + room.southBoundary.allowsVisibility;
                q3 = ', allowsAccess = ' + room.southBoundary.allowsAccess;
                q4 = ', allowsSmell = ' + room.southBoundary.allowsSmell;
                q5 = ' where id = ' + room.southBoundary.id;
                database.connection.query(q1+q2+q3+q4+q5, function(err){
                    if(err){
                        console.log(err);
                    }
                });

                q1 = 'update boundary set allowsSound = ' + room.westBoundary.allowsSound;
                q2 = ', allowsVisibility = ' + room.westBoundary.allowsVisibility;
                q3 = ', allowsAccess = ' + room.westBoundary.allowsAccess;
                q4 = ', allowsSmell = ' + room.westBoundary.allowsSmell;
                q5 = ' where id = ' + room.westBoundary.id;
                database.connection.query(q1+q2+q3+q4+q5, function(err){
                    if(err){
                        console.log(err);
                    }
                });
                    
                let theMap = Object.create(map);
                theMap.build(theGame, mapWidth, mapHeight, false);

                theGame.activePlayerList.forEach(function(character){
                    if(character.roomId === room.id){
                        dieAndRespawn(character, theGame, theGame.io.to(character.socketId));
                    }
                });
            }
        });
    });

    theGame.io.emit('explosion', null);

}
module.exports = game;