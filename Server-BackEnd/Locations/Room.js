const database = require('../database/connect-database');

const exit = require('../Game/Exit');
const boundary = require('../Locations/Boundary');
const commandList = require('../Commands/CommandList');

const room = {
    build: function(row){
        this.name = row.name;
        this.description = row.description;
        this.id = row.id;
        this.areaId = row.areaId;  
        this.northBoundary = row.northBoundary,
        this.eastBoundary = row.eastBoundary,
        this.southBoundary = row.southBoundary,
        this.westBoundary = row.westBoundary;
        this.position = row.position;
    },
    addExits: function(exits){
        this.exits = exits;
    },
    getBoundary: function(row, dir){
        let b = Object.create(boundary);
        b.build(row);

        if(dir === 'n'){
            this.northBoundary = b;
        } else if(dir === 'e'){
            this.eastBoundary = b;
        } else if(dir === 's'){
            this.southBoundary = b;
        } else if(dir === 'w'){
            this.westBoundary = b;
        }
    },
    getExits: function(theRoom, w, h){
        let theExits = [];

        let northExit = theRoom.position - w;
        let eastExit = theRoom.position + 1;
        let southExit = theRoom.position + w;
        let westExit = theRoom.position - 1;

        if(theRoom.northBoundary.allowsAccess === 1){
            let anExit = Object.create(exit);
            anExit.build(northExit, ['n', 'north', 'N', 'North', 
            'walk north', 'Walk north', 'Walk North', 'walk North',
            'walk n', 'walk N', 'Walk n', 'Walk N',
            'rn',
            'run north', 'Run north', 'Run North', 'run North',
            'run n', 'run N', 'Run n', 'Run N',
            'sneak north', 'Sneak north', 'Sneak North', 'sneak North',
            'sneak n', 'Sneak n', 'Sneak N', 'sneak N', 'sn']);
            theExits.push(anExit);
        }

        if(theRoom.eastBoundary.allowsAccess === 1){
            let anExit = Object.create(exit);
            anExit.build(eastExit, ['e', 'east', 'E', 'East',
            'walk east', 'Walk east', 'Walk East', 'walk East',
            'walk e', 'walk E', 'Walk e', 'Walk E',
            're',
            'run east', 'Run east', 'Run East', 'run East',
            'run e', 'run E', 'Run E', 'Run E',
            'sneak east', 'Sneak east', 'Sneak East', 'sneak East',
            'sneak e', 'Sneak e', 'Sneak E', 'sneak E', 'se']);
            theExits.push(anExit);
        }

        if(theRoom.southBoundary.allowsAccess === 1){
            let anExit = Object.create(exit);
            anExit.build(southExit, ['s', 'south', 'S', 'South',
            'walk south', 'Walk south', 'Walk South', 'walk South',
            'walk s', 'walk S', 'Walk s', 'Walk S',
            'rs',
            'run south', 'Run south', 'Run South', 'run South',
            'run s', 'run S', 'Run s', 'Run S',
            'sneak south', 'Sneak south', 'Sneak South', 'sneak South',
            'sneak s', 'Sneak s', 'Sneak S', 'sneak S', 'ss']);
            theExits.push(anExit);
        }

        if(theRoom.westBoundary.allowsAccess === 1){
            let anExit = Object.create(exit);
            anExit.build(westExit, ['w', 'west', 'W', 'West',
            'walk west', 'Walk west', 'Walk West', 'walk West',
            'walk w', 'walk W', 'Walk w', 'Walk W',
            'rw',
            'run west', 'Run west', 'Run West', 'run West',
            'run w', 'run W', 'Run w', 'Run W',
            'sneak west', 'Sneak west', 'Sneak West', 'sneak West',
            'sneak w', 'Sneak w', 'Sneak W', 'sneak W', 'sw']);
            theExits.push(anExit);
        }

        return theExits;
    },
    name: '',
    description: '',
    id: 0,
    areaId: 0,
    exits: [],
    position: 0,
    northBoundary: 0,
    eastBoundary: 0,
    southBoundary: 0,
    westBoundary: 0
}

module.exports = room;