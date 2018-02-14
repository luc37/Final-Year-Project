const command = {
    build: function(activationStrings, description, name){
        this.name = name;
        this.description = description;
        this.activationStrings = activationStrings;
    },
    activationStrings: [],
    description: '',
    name: ''
}

module.exports = command;
