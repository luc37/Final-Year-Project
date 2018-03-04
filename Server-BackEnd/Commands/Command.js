const command = {
    build: function(activationStrings, description, name, exeTime, executingText, completedText, socketCall){
        this.name = name;
        this.description = description;
        this.activationStrings = activationStrings;
        this.executionTime = exeTime;
        this.executingText = executingText;
        this.completedText = completedText;
        this.socketCall = socketCall;
    },
    activationStrings: [],
    description: '',
    name: '',
    executionTime: 0,
    executingText: '',
    completedText: '',
    socketCall: ''
}

module.exports = command;
