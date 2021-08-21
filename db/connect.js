const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "db4free.net",
    user: "quang_tin",
    password: "Ngolamquangtin1@",
    database: "datvephim",  
    port: 3306,
});
//Content Wrapper. Contains page content

module.exports = conn;