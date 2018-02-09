const room = {
    build: function(name, desc, id, areaId, exits){
        this.name = name;
        this.description = desc;
        this.id = id;
        this.areaId = areaId;
        this.exits = exits;
    },
    name: '',
    description: '',
    id: 0,
    areaId: 0,
    exits: []
}

module.exports = room;