const walkCommand = require('./Walk');
const runCommand = require('./Run');
const sneakCommand = require('./Sneak');
const command = require('./Command');
const shootCommand = require('./Shoot');
const toggleLights = require('./LightCommand');
const searchCommand = require('./Search');
const hideCommand = require('./Hide');
const turnOnCommand = require('./TurnOn');
const turnOffCommand = require('./TurnOff');
const pickUpCommand = require('./PickUp');
const dropCommand = require('./Drop');
const eatCommand = require('./Eat');
const detonateCommand = require('./Detonate');

const commandList = {
    build: function(list){
        this.list = list;
    },
    getList: function(){
        let theList = [];
        let sneakSpeed = 8;
        let walkSpeed = 4;
        let runSpeed = 2;

        let sneakNoise = 0;
        let walkNoise = 2;
        let runNoise = 4;

        let walkNorth = Object.create(walkCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', walkNorth, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', walkSpeed, walkSpeed, false, null, null, walkNoise);   
        walkNorth.activationStrings.push('n');
        theList.push(walkNorth);

        let walkEast = Object.create(walkCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', walkEast, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', walkSpeed, walkSpeed, false, null, null, walkNoise);    
        walkEast.activationStrings.push('e');
        theList.push(walkEast);

        let walkSouth = Object.create(walkCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', walkSouth, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', walkSpeed, walkSpeed, false, null, null, walkNoise);    
        walkSouth.activationStrings.push('s');
        theList.push(walkSouth);

        let walkWest = Object.create(walkCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', walkWest, 'Walk ', 'walk ', 'walking ', 'walked ', 
        'move to room', walkSpeed, walkSpeed, false, null, null, walkNoise);    
        walkWest.activationStrings.push('w');
        theList.push(walkWest);

        let runNorth = Object.create(runCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', runNorth, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', runSpeed, runSpeed, true, ['rn'], null, runNoise);    
        theList.push(runNorth);

        let runEast = Object.create(runCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', runEast, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', runSpeed, runSpeed, true, ['re'], null, runNoise);    
        theList.push(runEast);

        let runSouth = Object.create(runCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', runSouth, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', runSpeed, runSpeed, true, ['rs'],  null, runNoise);    
        theList.push(runSouth);

        let runWest = Object.create(runCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', runWest, 'Run ', 'run ', 'running ', 'ran ', 
        'move to room', runSpeed, runSpeed, true, ['rw'],  null, runNoise);    
        theList.push(runWest);
        
        let sneakNorth = Object.create(sneakCommand);
        MoveCommandBuilder('North', 'north', 'N', 'n', sneakNorth, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', sneakSpeed, sneakSpeed, true, ["sn"], null, sneakNoise);                
        theList.push(sneakNorth);

        let sneakEast = Object.create(sneakCommand);
        MoveCommandBuilder('East', 'east', 'E', 'e', sneakEast, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', sneakSpeed, sneakSpeed, true, ["se"],  null, sneakNoise);                   
        theList.push(sneakEast);

        let sneakSouth = Object.create(sneakCommand);
        MoveCommandBuilder('South', 'south', 'S', 's', sneakSouth, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', sneakSpeed, sneakSpeed, true, ["ss"],  null, sneakNoise);                  
        theList.push(sneakSouth);

        let sneakWest = Object.create(sneakCommand);
        MoveCommandBuilder('West', 'west', 'W', 'w', sneakWest, 'Sneak ', 'sneak ', 'sneaking ', 'sneaked ', 
        'move to room', sneakSpeed, sneakSpeed, true, ["sw"],  null, sneakNoise);                  
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

        let shootTarget = Object.create(shootCommand);
        shootTarget.build(['shoot ', 'Shoot '], 'Shoot at someone', 'Shoot', 2, 'aiming at ', 
        'shot at ', 'shoot target', 2, null, 12);
        shootTarget.setTarget(0);
        theList.push(shootTarget);

        let lights = Object.create(toggleLights);
        lights.build(['light on', 'lights on', 'Lights on', 'Turn lights on', 'turn lights on',
                    'light off', 'lights off', 'Lights off', 'Turn lights off', 'turn lights off',],
                    'Toggle lights', 'Lights', 1, 'turning lights ', 'turned lights ', 'toggle lights',
                    1, null, 0);
        lights.setStatus(0);
        theList.push(lights);

        let search = Object.create(searchCommand);
        search.build(['search ', 'search the ', 'search a ', 'Search ', 'Search the ', 'Search a '],
                    'search something', 'Search', 4, 'searching ', 'searched ', 'search item',
                    4, null, 4);
        search.setTarget(0);
        theList.push(search);

        let hide = Object.create(hideCommand);
        hide.build(['hide ', 'hide in ', 'hide behind ', 'hide under ', 
                    'Hide ', 'Hide in ', 'Hide behind ', 'Hide under '],
                    'hide somewhere', 'Hide', 4, 'hiding ', 'hid ', 'hide somewhere',
                    4, null, 0);
        hide.setStatus(0);
        hide.setTarget(0);
        theList.push(hide);

        let turnOn = Object.create(turnOnCommand);
        turnOn.build(['turn on ', 'turn on the ', 'turn on my ', 'Turn on the ',  'Turn on my ', 'Turn on '],
                    'turn something on', 'Turn on', 1, 'turning on ', 'turned on ', 'turn item on',
                    1, null, 1);
        turnOn.setTarget(0);
        theList.push(turnOn);

        let turnOff = Object.create(turnOffCommand);
        turnOff.build(['turn off ', 'turn off the ', 'turn off my ', 'Turn off the ',  'Turn off my ', 'Turn off '],
                    'turn something off', 'Turn off', 1, 'turning off ', 'turned off ', 'turn item off',
                    1, null, 1);
        turnOff.setTarget(0);
        theList.push(turnOff);

        let pickUp = Object.create(pickUpCommand);
        pickUp.build(['pick up ', 'pick up the ', 'pick up my ', 'Pick up the ',  'Pick up my ', 'Pick up '],
                    'pick something up', 'Pick Up', 2, 'picking up ', 'picked up ', 'pick up item',
                    2, null, 1);
        pickUp.setTarget(0);
        theList.push(pickUp);

        let drop = Object.create(dropCommand);
        drop.build(['drop ', 'drop the ', 'drop my ', 'Drop the ',  'Drop my ', 'Drop '],
                    'Drop something', 'Drop', 2, 'dropping ', 'dropped ', 'drop item',
                    2, null, 1);
        drop.setTarget(0);
        theList.push(drop);

        let eat = Object.create(eatCommand);
        eat.build(['eat ', 'eat the ', 'eat my ', 'Eat the ',  'Eat my ', 'Eat ', 'eat some ', 'Eat some ',
                  'eat a ', 'eat an ', 'Eat a ', 'Eat an '],
                    'Eat something', 'Eat', 3, 'munching on ', 'ate ', 'eat item',
                    3, null, 1);
        eat.setTarget(0);
        theList.push(eat);

        let detonate = Object.create(detonateCommand);
        detonate.build(['detonate ', 'detonate the ', 'detonate my ', 'Detonate the ',  'Detonate my ', 'Detonate ',
                  'detonate a ', 'detonate an ', 'Detonate a ', 'Detonate an '],
                    'Detonate bomb', 'Detonate', 3, 'detonating ', 'detonated ', 'detonate bomb',
                    3, null, 1);
        detonate.setTarget(0);
        theList.push(detonate);

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