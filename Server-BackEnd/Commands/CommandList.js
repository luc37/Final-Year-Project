const walkCommand = require('./Walk');
const runCommand = require('./Run');
const sneakCommand = require('./Sneak');
const command = require('./Command');

const commandList = {
    build: function(list){
        this.list = list;
    },
    getList: function(){
        let theList = [];

        let walkNorth = Object.create(walkCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', walkNorth, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', 2, 2, false, null, null, 4);   
        walkNorth.activationStrings.push('n');
        theList.push(walkNorth);

        let walkEast = Object.create(walkCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', walkEast, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', 2, 2, false, null, null, 4);    
        walkEast.activationStrings.push('e');
        theList.push(walkEast);

        let walkSouth = Object.create(walkCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', walkSouth, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', 2, 2, false, null, null, 4);    
        walkSouth.activationStrings.push('s');
        theList.push(walkSouth);

        let walkWest = Object.create(walkCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', walkWest, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', 2, 2, false, null, null, 4);    
        walkWest.activationStrings.push('w');
        theList.push(walkWest);

        let runNorth = Object.create(runCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', runNorth, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', 1, 1, true, ['rn'], null, 8);    
        theList.push(runNorth);

        let runEast = Object.create(runCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', runEast, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', 1, 1, true, ['re'], null, 8);    
        theList.push(runEast);

        let runSouth = Object.create(runCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', runSouth, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', 1, 1, true, ['rs'],  null, 8);    
        theList.push(runSouth);

        let runWest = Object.create(runCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', runWest, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', 1, 1, true, ['rw'],  null, 8);    
        theList.push(runWest);
        
        let sneakNorth = Object.create(sneakCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', sneakNorth, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', 4, 4, true, ["sn"], null, 2);                
        theList.push(sneakNorth);

        let sneakEast = Object.create(sneakCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', sneakEast, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', 4, 4, true, ["se"],  null, 2);                   
        theList.push(sneakEast);

        let sneakSouth = Object.create(sneakCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', sneakSouth, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', 4, 4, true, ["ss"],  null, 2);                  
        theList.push(sneakSouth);

        let sneakWest = Object.create(sneakCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', sneakWest, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', 4, 4, true, ["sw"],  null, 2);                  
        theList.push(sneakWest);

        let lookNorth = Object.create(command);
        MoveCommandBuilder('North', 'north', 'N', 'n', lookNorth, 'Look ', 'look ', 'looking ', 'looked ', 
        'look direction', 0, 0, true, ["ln"], null, 0);                
        theList.push(lookNorth);

        let lookEast = Object.create(command);
        MoveCommandBuilder('East', 'east', 'E', 'e', lookEast, 'Look ', 'look ', 'looking ', 'looked ', 
        'look direction', 0, 0, true, ["le"], null, 0);                
        theList.push(lookEast);

        let lookSouth = Object.create(command);
        MoveCommandBuilder('South', 'south', 'S', 's', lookSouth, 'Look ', 'look ', 'looking ', 'looked ', 
        'look direction', 0, 0, true, ["ls"], null, 0);                
        theList.push(lookSouth);

        let lookWest = Object.create(command);
        MoveCommandBuilder('West', 'west', 'W', 'w', lookWest, 'Look ', 'look ', 'looking ', 'looked ', 
        'look direction', 0, 0, true, ["lw"], null, 0);                
        theList.push(lookWest);

        return theList;
    },
    list:[]
}

MoveCommandBuilder = function(  dirU, dirL, dU, dL, command, comTextU, comTextL, pres, past, 
                                socketCall, exeTime, exingTime, additionalCommandsBool, additionalCommandsStrings,
                                dependantSocketCalls, loudness){
    
    if(additionalCommandsBool === true){
        command.build([comTextL+dirL, comTextU+dirL, comTextU+dirU, comTextL+dirU,
            comTextL+dL, comTextL+dU, comTextU+dL, comTextU+dU, additionalCommandsStrings[0]], 
            comTextU + 'to the next room in a ' + dirL + 'bound direction', 
            comTextU+dirL, exeTime, pres+dirL, past+dirL,
            socketCall, exingTime, dependantSocketCalls, loudness);
    } else{
        command.build([comTextL+dirL, comTextU+dirL, comTextU+dirU, comTextL+dirU,
                        comTextL+dL, comTextL+dU, comTextU+dL, comTextU+dU], 
                        comTextU + 'to the next room in a ' + dirL + 'bound direction', 
                        comTextU+dirL, exeTime, pres+dirL, past+dirL,
                        socketCall, exingTime, dependantSocketCalls, loudness);
    }

    
}

module.exports = commandList;