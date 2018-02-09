const character = {
    build: function(name, id, isChar, commands, socketId, alreadySignedIn){
        this.name = name;
        this.id = id;
        this.isChar = isChar;
        this.commands = commands;
        this.socketId = socketId;
    },
    name: '',
    id: 0,
    commands: [],
    isChar: false,
    socketId: ''
}

module.exports = character;