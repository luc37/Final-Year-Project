const database = require('../database/connect-database');

const room = require('../Locations/Room');
const light = require('../Game/Objects/Light');
const item = require('../Game/Objects/Item');

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
                        database.connection.query('select * from lights', function(err, lights){
                            if(err){
                                console.log(err);
                            } else {
                                database.connection.query('select * from allitems', function(err, allItems){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        database.connection.query('select * from items', function(err, items){
                                            if(err){
                                                console.log(err);
                                            } else {
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
                                                    let o = [];
                                                    r.setObjects(o);
                                                });
                        
                                                rooms.forEach(function(r){
                                                    lights.forEach(function(theLight){
                                                        if(r.id === theLight.roomId){
                                                            let aLight = Object.create(light);
                                                            aLight.build(theLight, 'There is a light switch');
                                                            let o = [aLight];
                                                            r.setLights(o);
                                                        }
                                                    });
                                                });

                                                items.forEach(function(anItem){
                                                    allItems.forEach(function(allItem){
                                                        if(anItem.allitemsId === allItem.id){
                                                            let theItem = Object.create(item);
                                                            theItem.build(anItem, allItem);
                                                            
                                                            rooms.forEach(function(r){
                                                                if(theItem.roomId === r.id){
                                                                    r.addObject(theItem);
                                                                }
                                                            });
                                                        }
                                                    });
                                                });

                                                theGame.map = rooms;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = map;