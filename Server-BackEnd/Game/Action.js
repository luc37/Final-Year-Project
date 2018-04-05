const action = {
    build: function(time, text, completedText, instigator, target, command, status){
        this.time = time;
        this.text = text;
        this.completedText = completedText;
        this.instigator = instigator;
        this.target = target;
        this.command =command;
    },
    time: 0,
    text: '',
    completedText: '',
    instigator: {},
    target: {},
    command:{},
}

module.exports = action;