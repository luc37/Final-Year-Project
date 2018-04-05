const commandList = require('../Commands/CommandList');

function buildCommandList(){
    let list = Object.create(commandList);
    list.build(list.getList());
    
    return list;
}

const character = {
    build: function(row, isChar, socketId){
        this.name = row.characterName;
        this.id = row.characterId;
        this.isChar = isChar;
        this.commandList = buildCommandList();
        this.socketId = socketId;
        this.roomId = row.roomId;
        this.lookDirection = row.lookDirection;
        this.smell = row.smell;
        this.sound = 0;
        this.health = row.health;
        this.bullets = row.bullets;
        this.gunPower = row.gunPower;
        this.reload = 3;
        this.aim = row.aim;
        this.inventory = [];
        this.clumsiness = row.clumsiness;
        this.maxHealth = row.maxhealth;
    },
    buildInventory: function(array){
        this.inventory = array;
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
    aim: 0,
    inventory: [],
    clumsiness: 0,
    maxHealth:10
}

module.exports = character;