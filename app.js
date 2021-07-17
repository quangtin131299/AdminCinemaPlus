const express = require('express');
const app = express();
const phim = require("./route/phim")
const customer = require("./route/customer")
const ticker = require("./route/ticker")
const rapchieu = require("./route/rapchieuphim")
const lichchieu = require("./route/lichchieu")
const login = require("./route/login");
const phong = require("./route/phong");
const home = require("./route/home");
const ghe = require("./route/ghe");
const nhacungcap = require("./route/nhacungcap");
const hoadon = require("./route/hoadon");
const dichvu = require("./route/dichvu");
const soatve = require("./route/soatve");

app.use("/phim", phim);
app.use("/ticker", ticker);
app.use("/customer",customer);
app.use("/rapchieu", rapchieu);
app.use("/lichchieu", lichchieu);
app.use("/login", login);
app.use("/phong", phong);
app.use("/home", home)
app.use("/ghe", ghe);
app.use("/nhacungcap", nhacungcap);
app.use("/hoadon", hoadon);
app.use("/dichvu", dichvu);
app.use("/soatve", soatve);
app.use(express.static("views"))

app.set('views', './views')
app.set('view engine', 'pug')

app.use(function(req, res){
    res.render("login/login")
})

app.listen(process.env.PORT || 5000)





