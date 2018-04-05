const command = require('../Commands/Command');

const statusCommand = {
    setStatus: function(status){
        this.status = status;
    },
    status: 0
}

Object.setPrototypeOf(statusCommand, command);
module.exports = statusCommand;