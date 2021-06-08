const express = require('express');
const app = express();
const phim = require("./route/phim")
const customer = require("./route/customer")
const ticker = require("./route/ticker")
const rapchieu = require("./route/rapchieuphim")
const lichchieu = require("./route/lichchieu")
const uploadfile = require("./route/uploadimg");
const login = require("./route/login");
const phong = require("./route/phong");
const home = require("./route/home");
const hoadon = require("./route/hoadon");

app.listen(process.env.PORT || 3000)

app.use("/uploadanh", uploadfile);
app.use("/phim", phim);
app.use("/ticker", ticker);
app.use("/customer",customer);
app.use("/rapchieu", rapchieu);
app.use("/lichchieu", lichchieu);
app.use("/login", login);
app.use("/phong", phong);
app.use("/home", home);
app.use("/hoadon", hoadon);
app.use(express.static("views"))

app.set('views', './views')
app.set('view engine', 'pug')

app.use(function(req, res){
    res.render("login/login")
})





