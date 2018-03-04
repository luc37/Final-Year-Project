const walkCommand = require('./Walk');
const runCommand = require('./Run');
const sneakCommand = require('./Sneak');

const commandList = {
    build: function(list){
        this.list = list;
    },
    getList: function(){
        let theList = [];

        let walkNorth = Object.create(walkCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', walkNorth, 'Walk ', 'walk ', 'walking ', 'walked ', 'move to room', 8);
        walkNorth.activationStrings.push('n');
        theList.push(walkNorth);

        let walkEast = Object.create(walkCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', walkEast, 'Walk ', 'walk ', 'walking ', 'walked ', 'move to room', 8);
        walkEast.activationStrings.push('e');
        theList.push(walkEast);

        let walkSouth = Object.create(walkCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', walkSouth, 'Walk ', 'walk ', 'walking ', 'walked ', 'move to room', 8);
        walkSouth.activationStrings.push('s');
        theList.push(walkSouth);

        let walkWest = Object.create(walkCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', walkWest, 'Walk ', 'walk ', 'walking ', 'walked ', 'move to room', 8);
        walkWest.activationStrings.push('w');
        theList.push(walkWest);

        let runNorth = Object.create(runCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', runNorth, 'Run ', 'run ', 'running ', 'ran ', 'move to room', 4);
        theList.push(runNorth);

        let runEast = Object.create(runCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', runEast, 'Run ', 'run ', 'running ', 'ran ', 'move to room', 4);
        theList.push(runEast);

        let runSouth = Object.create(runCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', runSouth, 'Run ', 'run ', 'running ', 'ran ', 'move to room', 4);
        theList.push(runSouth);

        let runWest = Object.create(runCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', runWest, 'Run ', 'run ', 'running ', 'ran ', 'move to room', 4);
        theList.push(runWest);
        
        let sneakNorth = Object.create(sneakCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', sneakNorth, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 'move to room', 16);                
        theList.push(sneakNorth);

        let sneakEast = Object.create(sneakCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', sneakEast, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 'move to room', 16);                
        theList.push(sneakEast);

        let sneakSouth = Object.create(sneakCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', sneakSouth, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 'move to room', 16);                
        theList.push(sneakSouth);

        let sneakWest = Object.create(sneakCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', sneakWest, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 'move to room', 16);                
        theList.push(sneakWest);

        return theList;
    },
    list:[]
}

MoveCommandBuilder = function(dirU, dirL, dU, dL, sneak, comTextU, comTextL, pres, past, socketCall, exeTime){
    sneak.build([comTextL+dirL, comTextU+dirL, comTextU+dirU, comTextL+dirU,
                comTextL+dL, comTextL+dU, comTextU+dL, comTextU+dU], 
                comTextU + 'to the next room in a ' + dirL + 'bound direction', 
                comTextU+dirL, exeTime, pres+dirL, past+dirL,
                socketCall);
}

module.exports = commandList;