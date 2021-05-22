const express = require('express');

const app = express();
const phim = require("./route/phim")
const customer = require("./route/customer")
const ticker = require("./route/ticker")
const rapchieu = require("./route/rapchieuphim")
const lichchieu = require("./route/lichchieu")
const uploadfile = require("./route/uploadimg");

app.listen(process.env.PORT || 3000)

app.use("/uploadanh", uploadfile)
app.use("/phim", phim)
app.use("/ticker", ticker)
app.use("/customer",customer)
app.use("/rapchieu", rapchieu)
app.use("/lichchieu", lichchieu)
app.use(express.static("views"))
app.set('views', './views')
app.set('view engine', 'pug')

app.get("/", function(req, res){
    res.render("index")
})





