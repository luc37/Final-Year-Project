const commandList = require('../Commands/CommandList');

function buildCommandList(){
    let list = Object.create(commandList);
    list.build(list.getList());
    
    return list;
}

const character = {
    build: function(name, id, isChar, socketId, roomId){
        this.name = name;
        this.id = id;
        this.isChar = isChar;
        this.commandList = buildCommandList();
        this.socketId = socketId;
        this.roomId = roomId;
    },
    name: '',
    id: 0,
    commandList: [],
    isChar: false,
    socketId: '',
    roomId: null,
    moveToNewRoom: function(){
        console.log('move room function');
    }
}

module.exports = character;