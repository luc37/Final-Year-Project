const database = require('../database/connect-database');

const room = require('../Locations/Room');
const map = require('../Game/Map');
const sound = require('../Game/Sound');

const mapHeight = 10;
const mapWidth = 10;

const game = {
    build: function(startRoomId){
        this.startRoomId = startRoomId;
    },
    setUp: function(theGame, socket, io){

        theMap = Object.create(map);
        theMap.build(theGame, mapWidth, mapHeight);
        
        socket.on('colour ui map', function(){
            io.sockets.emit('colour ui map', theGame.map);
        });

        socket.on('look direction', function(){
            socket.emit('colour ui map', theGame.map);
        });

        socket.on('move to room', function(character){
            theGame.buildRoom(character, socket, io);
        });

        socket.on('made a sound', function(theSound){
            newSound = Object.create(sound);
            newSound.build(theSound.range, theSound.length, theSound.originId);

            theGame.addSound(newSound);
            io.emit('update sounds', theGame.sounds);
        });

        socket.on('switch tabs', function(character){
            theGame.activePlayerList.forEach(element => {
    
                if(element.id === character.id){
                    element.socketId = socket.id;
                    
                    setUpPlayScreen(socket, io);
                    io.sockets.connected[character.socketId].disconnect();
    
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
            } else{
                object.text = 'different socket call'
                socket.broadcast.emit('update additional info', object);
            }
            
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

        this.sounds.forEach(function(sound, i){
            if(sound.length === 0){
                ctrl.removeSound(i);
            } else{
                sound.length = sound.length -1;
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
        let destId;

        if(character.roomId === null){
            destId = this.startRoomId;
        }else{
            destId = character.roomId;
        }

        let query = 'UPDATE user set roomId = ' + destId + ' where characterId = '+ character.id;
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
    },
    buildArea: function(){

    },
    addSound: function(sound){
        this.sounds.push(sound);
    },
    removeSound: function(i){
        this.sounds.splice(i, 1);
    },
    startRoomId: 0,
    activePlayerList:[],
    map:[],
    sounds:[]
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