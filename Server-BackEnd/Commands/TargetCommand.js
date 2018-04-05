const command = require('../Commands/Command');

const targetCommand = {
    setTarget: function(target){
        this.target = target;
    },
    target: 0
}

Object.setPrototypeOf(targetCommand, command);
module.exports = targetCommand;