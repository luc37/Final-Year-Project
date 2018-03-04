const room = require('../Locations/Room');
const database = require('../database/connect-database');

const game = {
    build: function(startRoomId){
        this.startRoomId = startRoomId;
    },
    setUp: function(theGame, socket, io){

        socket.on('move to room', function(character){
            theGame.buildRoom(character, socket, io);
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

        socket.on('update additional info', function(arr){
            socket.broadcast.emit('update additional info', arr);
        });

        socket.on('disconnect', function () {
            theGame.removePlayerFromActivePlayerList(socket.id);
            io.emit('connection count', getClientCount(io));
            io.emit('player list', theGame.activePlayerList);
            io.emit('update room lists', null);
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
        io.emit('updateGame', 'Update Game');
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
                theRoom.build(rows[0].name, rows[0].description, rows[0].id, rows[0].areaId, theRoom.getExits(rows[0]));
                socket.emit('the room', theRoom);

                ctrl.activePlayerList.forEach(char =>{
                    if(char.id === character.id){
                        char.roomId = character.roomId;
                    }
                });
                
                io.emit('player list', ctrl.activePlayerList);
            }
        });
    },
    buildArea: function(){

    },
    startRoomId: 0,
    activePlayerList:[]
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