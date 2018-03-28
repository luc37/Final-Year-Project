const command = {
    build: function(activationStrings, description, name, exeTime, executingText, 
                    completedText, socketCall, executingTime, dependantSocketCalls){
        this.name = name;
        this.description = description;
        this.activationStrings = activationStrings;
        this.executionTime = exeTime;
        this.executingText = executingText;
        this.completedText = completedText;
        this.socketCall = socketCall;
        this.executingTime = executingTime;
        this.dependantSocketCalls = dependantSocketCalls;
    },
    activationStrings: [],
    description: '',
    name: '',
    executionTime: 0,
    executingText: '',
    completedText: '',
    socketCall: '',
    dependantSocketCalls: []
}

module.exports = command;
