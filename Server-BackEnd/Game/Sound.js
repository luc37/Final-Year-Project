const sound = {
    build: function(loudness, length, originId){
        this.loudness = loudness;
        this.length = length;
        this.originId = originId;
    },
    loudness: 0,
    length: 0,
    originId: 0
}

module.exports = sound;