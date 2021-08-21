const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "mysql-46163-0.cloudclusters.net",
    user: "admin",
    password: "c6xFGqF6",
    database: "cinemaplus",  
    port: 19907
});
//Content Wrapper. Contains page content

module.exports = conn;