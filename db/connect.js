const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "mysql.100ws.com",
    user: "cbacdf_datvephim",
    password: "Ngolamquangtin1@",
    database: "cbacdf_datvephim",  
    port: 3306,
});
//Content Wrapper. Contains page content

module.exports = conn;