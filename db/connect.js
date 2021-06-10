const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "datvephim",  
    port: 3306,
});
//Content Wrapper. Contains page content

module.exports = conn;