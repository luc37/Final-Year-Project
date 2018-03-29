const command = {
    build: function(activationStrings, description, name, exeTime, executingText, 
                    completedText, socketCall, executingTime, dependantSocketCalls,
                    loudness){
        this.name = name;
        this.description = description;
        this.activationStrings = activationStrings;
        this.executionTime = exeTime;
        this.executingText = executingText;
        this.completedText = completedText;
        this.socketCall = socketCall;
        this.executingTime = executingTime;
        this.dependantSocketCalls = dependantSocketCalls;
        this.loudness = loudness;
    },
    activationStrings: [],
    description: '',
    name: '',
    executionTime: 0,
    executingText: '',
    completedText: '',
    socketCall: '',
    dependantSocketCalls: [],
    loudness: 0,
}

module.exports = command;
