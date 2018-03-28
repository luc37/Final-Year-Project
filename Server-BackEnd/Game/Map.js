const database = require('../database/connect-database');

const room = require('../Locations/Room');

const map = {
    build: function(theGame, mapWidth, mapHeight){
        database.connection.query('select * from room', function(err, rows){
            if(err){
                console.log(err);
            } else{
                database.connection.query('select * from boundary', function(err, rs){
                    if(err){
                        console.log(err);
                    } else{
                        let rooms = []

                        rows.forEach(function(r){
                            let aRoom = Object.create(room);
                            aRoom.build(r);
                            rooms.push(aRoom);
                        });

                        rooms.forEach(function(r){
                            rs.forEach(function(boundary){
                                if(r.northBoundary === boundary.id){
                                    r.getBoundary(boundary, 'n');
                                } else if(r.eastBoundary === boundary.id){
                                    r.getBoundary(boundary, 'e');
                                } else if(r.southBoundary === boundary.id){
                                    r.getBoundary(boundary, 's');
                                } else if(r.westBoundary === boundary.id){
                                    r.getBoundary(boundary, 'w');
                                }
                            });
                        });

                        rooms.forEach(function(r){

                            r.addExits(r.getExits(r, mapWidth, mapHeight));
                        });


                        theGame.map = rooms;
                    }
                });
            }
        });
    }
}

module.exports = map;