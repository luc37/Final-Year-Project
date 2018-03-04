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
            anExit.build(roomRow.northId, ['n', 'north', 'N', 'North', 
            'walk north', 'Walk north', 'Walk North', 'walk North',
            'walk n', 'walk N', 'Walk n', 'Walk N',
            'run north', 'Run north', 'Run North', 'run North',
            'run n', 'run N', 'Run n', 'Run N',
            'sneak north', 'Sneak north', 'Sneak North', 'sneak North',
            'sneak n', 'Sneak n', 'Sneak N', 'sneak N']);
            theExits.push(anExit);
        }

        if(roomRow.eastId != null){
            let anExit = Object.create(exit);
            anExit.build(roomRow.eastId, ['e', 'east', 'E', 'East',
            'walk east', 'Walk east', 'Walk East', 'walk East',
            'walk e', 'walk E', 'Walk e', 'Walk E',
            'run east', 'Run east', 'Run East', 'run East',
            'run e', 'run E', 'Run E', 'Run E',
            'sneak east', 'Sneak east', 'Sneak East', 'sneak East',
            'sneak e', 'Sneak e', 'Sneak E', 'sneak E']);
            theExits.push(anExit);
        }

        if(roomRow.southId != null){
            let anExit = Object.create(exit);
            anExit.build(roomRow.southId, ['s', 'south', 'S', 'South',
            'walk south', 'Walk south', 'Walk South', 'walk South',
            'walk s', 'walk S', 'Walk s', 'Walk S',
            'run south', 'Run south', 'Run South', 'run South',
            'run s', 'run S', 'Run s', 'Run S',
            'sneak south', 'Sneak south', 'Sneak South', 'sneak South',
            'sneak s', 'Sneak s', 'Sneak S', 'sneak S']);
            theExits.push(anExit);
        }

        if(roomRow.westId != null){
            let anExit = Object.create(exit);
            anExit.build(roomRow.westId, ['w', 'west', 'W', 'West',
            'walk west', 'Walk west', 'Walk West', 'walk West',
            'walk w', 'walk W', 'Walk w', 'Walk W',
            'run west', 'Run west', 'Run West', 'run West',
            'run w', 'run W', 'Run w', 'Run W',
            'sneak west', 'Sneak west', 'Sneak West', 'sneak West',
            'sneak w', 'Sneak w', 'Sneak W', 'sneak W']);
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