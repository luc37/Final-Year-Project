const database = require('../database/connect-database');

const room = require('../Locations/Room');
const light = require('../Game/Objects/Light');
const item = require('../Game/Objects/Item');
const bombItem = require('../Game/Objects/Bomb');

const map = {
    build: function(theGame, mapWidth, mapHeight, buildBomb){
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
                                                    if(r.description !== 'A pile of rubble.'){
                                                        lights.forEach(function(theLight){
                                                            if(r.id === theLight.roomId){
                                                                let aLight = Object.create(light);
                                                                aLight.build(theLight, 'There is a light switch');
                                                                let o = [aLight];
                                                                r.setLights(o);
                                                            }
                                                        });
                                                    }
                                                    
                                                });

                                                items.forEach(function(anItem){
                                                    allItems.forEach(function(allItem){
                                                        if(anItem.allitemsId === allItem.id && allItem.name !== 'Bomb'){
                                                            let theItem = Object.create(item);
                                                            theItem.build(anItem, allItem, true);
                                                            
                                                            rooms.forEach(function(r){
                                                                if(theItem.roomId === r.id && r.description !== 'A pile of rubble.'){
                                                                    r.addObject(theItem);
                                                                }
                                                            });
                                                        }
                                                    });
                                                });

                                                if(buildBomb){
                                                    let searchItems = [];
                                                    rooms.forEach(function(r){
                                                        r.objects.forEach(function(o){
                                                            if(o.type.includes('Search')){
                                                                searchItems.push(o);
                                                            }
                                                        });
                                                    });
    
                                                    //let bombItemStore = Math.floor(Math.random() * searchItems.length);
                                                    let bombItemStore = 25;

                                                    items.forEach(function(anItem){
                                                        allItems.forEach(function(allItem){
                                                            if(anItem.allitemsId === allItem.id && allItem.name === 'Bomb'){
                                                                let bomb = Object.create(bombItem);
        
                                                                let itemData = anItem;
                                                                itemData.roomId = searchItems[bombItemStore].roomId;

                                                                bomb.build(itemData, allItem, false);
                                                                bomb.buildBomb(10, 'not armed')
                                                                rooms[bomb.roomId-1].addObject(bomb);
                                                                theGame.bomb = bomb;
                                                            }
                                                        });
                                                    });
                                                    
                                                    //console.log(theGame.bomb);

                                                    //set up rooms after explosion 
                                                    let q1 = 'delete from boundary where id > -2';
                                                    database.connection.query(q1, function(err){
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                    });

                                                    let q2 = 'load data local infile \'../MapCSV/boundary.csv\' into table boundary';
                                                    let q3 =  ' fields terminated by \',\'';
                                                    let q4 = ' enclosed by \'"\'';
                                                    let q5 = ' lines terminated by \'\n\''
                                                    database.connection.query(q2+q3+q4+q5, function(err){
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                    });

                                                    let q6 = 'delete from room where id > -2';
                                                    database.connection.query(q6, function(err){
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                    });

                                                    let q7 = 'load data local infile \'../MapCSV/room.csv\' into table room';
                                                    let q8 =  ' fields terminated by \',\'';
                                                    let q9 = ' enclosed by \'"\'';
                                                    let q10 = ' lines terminated by \'\n\''
                                                    database.connection.query(q7+q8+q9+q10, function(err){
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                    });


                                                } else {
                                                    if(theGame.bomb.pickUpStatus !== 'picked up'){
                                                        rooms[theGame.bomb.roomId-1].addObject(theGame.bomb);
                                                    }
                                                }
                                                theGame.gameMap = rooms;
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