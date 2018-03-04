const mysql = require('mysql');

const database = {
    connection: connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Mnbvcxz111&&&999',
        database: 'mudserver'
        //socketPath: '/var/run/mysqld/mysqld.sock'
    })
}

module.exports = database;
