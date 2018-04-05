const light = {
    build: function(row, displayText){
        this.id = row.id;
        this.roomId = row.roomId;
        this.circuit = row.circuit;
        this.status = row.status;
        this.displayText = displayText;
    },
    id: 0,
    roomId: 0,
    circuit: 0,
    status: 'ON',
    displayText: ''
}

module.exports = light;