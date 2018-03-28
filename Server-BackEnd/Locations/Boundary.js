const boundary = {
    build: function(id, roomId, allowsVisibility, allowsSmell, allowsSound, allowsAccess){
        this.id = id;
        this.roomId = roomId;
        this.allowsVisibility = allowsVisibility;
        this.allowsSmell = allowsSmell;
        this.allowsSound = allowsSound;
        this.allowsAccess = allowsAccess;
    },
    build: function(row){
        this.id = row.id;
        this.roomId = row.roomId;
        this.allowsVisibility = row.allowsVisibility;
        this.allowsSmell = row.allowsSmell;
        this.allowsSound = row.allowsSound;
        this.allowsAccess = row.allowsAccess;
    },
    id: 0,
    roomId: 0,
    allowsVisibility: 0,
    allowsSmell: 0,
    allowsSound: 0,
    allowsAccess:0,
}

module.exports = boundary;