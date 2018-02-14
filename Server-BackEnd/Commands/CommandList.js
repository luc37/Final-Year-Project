const exitRoomCommand = require('./exit-room');

const commandList = {
    build: function(list){
        this.list = list;
    },
    getList: function(){
        let theList = [];

        let exitRoomNorth = Object.create(exitRoomCommand);
        exitRoomNorth.build(['n', 'north', 'N', 'North'], 
                        'Command to exit a room in a northwise direction', 
                        'Exit room north');
        theList.push(exitRoomNorth);

        let exitRoomEast = Object.create(exitRoomCommand);
        exitRoomEast.build(['e', 'east', 'E', 'East'], 
                        'Command to exit a room in a eastwise direction', 
                        'Exit room east');
        theList.push(exitRoomEast);

        let exitRoomSouth = Object.create(exitRoomCommand);
        exitRoomSouth.build(['s', 'south', 'S', 'South'], 
                        'Command to exit a room in a southwise direction', 
                        'Exit room south');
        theList.push(exitRoomSouth);

        let exitRoomWest = Object.create(exitRoomCommand);
        exitRoomWest.build(['w', 'west', 'W', 'West'], 
                        'Command to exit a room in a westwise direction', 
                        'Exit room west');
        theList.push(exitRoomWest);

        return theList;
    },
    list:[]
}

module.exports = commandList;