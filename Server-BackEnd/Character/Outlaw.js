const character = require('../Character/Character');

const outlaw = {
    updateStatus: function(status){
        this.status = status;
    },
    updateRoute: function(route){
        this.route = route;
    },
    status: '',
    route: [],
    executingCommand: false,
    command: {},
    lastRoom: 0,
    waitTime: 0
}

Object.setPrototypeOf(outlaw, character);
module.exports = outlaw;