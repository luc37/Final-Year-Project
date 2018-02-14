const exit = require('../Game/Exit');
const commandList = require('../Commands/CommandList');

const room = {
    build: function(name, desc, id, areaId, exits){
        this.name = name;
        this.description = desc;
        this.id = id;
        this.areaId = areaId;
        this.exits = exits;
    },
    getExits: function(roomRow){
        let theExits = [];

        //let list = Object.create(commandList);
        //list.build(list.getList());
        //console.log(list);

        if(roomRow.northId != null){
            let anExit = Object.create(exit);
            anExit.build(roomRow.northId, ['n', 'north', 'N', 'North']);
            theExits.push(anExit);
        }

        if(roomRow.eastId != null){
            let anExit = Object.create(exit);
            anExit.build(roomRow.eastId, ['e', 'east', 'E', 'East']);
            theExits.push(anExit);
        }

        if(roomRow.southId != null){
            let anExit = Object.create(exit);
            anExit.build(roomRow.southId, ['s', 'south', 'S', 'South']);
            theExits.push(anExit);
        }

        if(roomRow.westId != null){
            let anExit = Object.create(exit);
            anExit.build(roomRow.westId, ['w', 'west', 'W', 'West']);
            theExits.push(anExit);
        }

        return theExits;
    },
    name: '',
    description: '',
    id: 0,
    areaId: 0,
    exits: []
}

module.exports = room;