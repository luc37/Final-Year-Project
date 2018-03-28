const commandList = require('../Commands/CommandList');

function buildCommandList(){
    let list = Object.create(commandList);
    list.build(list.getList());
    
    return list;
}

const character = {
    build: function(name, id, isChar, socketId, roomId, lookDirection){
        this.name = name;
        this.id = id;
        this.isChar = isChar;
        this.commandList = buildCommandList();
        this.socketId = socketId;
        this.roomId = roomId;
        this.lookDirection = lookDirection;
    },
    name: '',
    id: 0,
    commandList: [],
    isChar: false,
    socketId: '',
    roomId: null,
    lookDirection: '',
    moveToNewRoom: function(){
        console.log('move room function');
    }
}

module.exports = character;