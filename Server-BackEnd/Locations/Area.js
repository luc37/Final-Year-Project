const area = {
    build: function(name, desc, id, startRoomId){
        this.name = name;
        this.startRoomId = startRoomId;
        this.description = desc;
        this.id = id;
    },
    name: '',
    description: '',
    id: 0,
    startRoomId: 0
}

module.exports = area;