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
        this.smell = 0;
        this.sound = 0;
        this.health = 10;
        this.bullets = 8;
        this.gunPower = 2;
        this.reload = 3;
    },
    name: '',
    id: 0,
    commandList: [],
    isChar: false,
    socketId: '',
    roomId: null,
    lookDirection: '',
    smell: 0,
    sound: 0,
    health: 0,
    bullets: 0,
    gunPower: 0,
    reload: 0,
    moveToNewRoom: function(){
        console.log('move room function');
    }
}

module.exports = character;