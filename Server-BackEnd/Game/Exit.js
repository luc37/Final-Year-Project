const exit = {
    build: function(destinationId, activationCommands){
        this.destinationId = destinationId;
        this.activationCommands = activationCommands;
    },
    destinationId: 0,
    activationCommands: []
}

module.exports = exit;