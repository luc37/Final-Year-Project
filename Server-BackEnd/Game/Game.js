const room = require('../Locations/Room');
const character = require('../Character/Character');

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
    buildRoom: function(){

    },
    buildArea: function(){

    },
    startRoomId: 0,
    activePlayerList:[]
}

module.exports = game;