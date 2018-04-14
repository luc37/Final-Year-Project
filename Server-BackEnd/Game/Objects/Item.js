const item = {
    build: function(item, allItem, visible){
        this.id = item.id;
        this.roomId = item.roomId;
        this.name = allItem.name;
        this.singular = allItem.singular;
        this.plural = allItem.plural;
        this.type = allItem.type;
        this.pickUpStatus = item.pickUpStatus;
        this.turnOnStatus = item.turnOnStatus;
        this.flavourText = item.flavourText;
        this.containerSingular = allItem.containerSingular;
        this.containerPlural = allItem.containerPlural;
        this.hideWord = allItem.hideWord;
        this.visible = visible;
    },
    buildActivationStrings: function(activationStrings){
        this.activationStrings = activationStrings;
    },
    id: 0,
    roomId: 0,
    name: 0,
    singular: '',
    plural: '',
    type: '',
    activationStrings: [],
    pickUpStatus: '',
    turnOnStatus: '',
    flavourText: '',
    containerSingular: '',
    containerPlural: '',
    hideWord: '',
    visible: true
}

module.exports = item;