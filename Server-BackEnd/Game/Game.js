const room = require('../Locations/Room');
const database = require('../database/connect-database');

const game = {
    build: function(startRoomId){
        this.startRoomId = startRoomId;
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

        database.connection.query('SELECT * from room where id = ' + destId + ' limit 1', function(err, rows){
            if(err){
                console.log(err);
            }else{
                theRoom.build(rows[0].name, rows[0].description, rows[0].id, rows[0].areaId, theRoom.getExits(rows[0]));
                socket.emit('the room', theRoom);

                ctrl.activePlayerList.forEach(char =>{
                    if(char.id === character.characterId){
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

module.exports = game;