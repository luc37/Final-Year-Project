const command = require('../Commands/Command');

const TSCommand = {
    setStatus: function(status){
        this.status = status;
    },
    status: 0,
    setTarget: function(target){
        this.target = target;
    },
    target: 0
}

Object.setPrototypeOf(TSCommand, command);
module.exports = TSCommand;