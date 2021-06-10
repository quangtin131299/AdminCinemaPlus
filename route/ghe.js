const express = require("express")
const conn = require("../db/connect")
const router = express.Router()

router.use(express.static("views"))

router.get("/danhsachghe", function(req,res){
    res.render("ghe/danhsachghe");
})

router.get("/themghe",function(req, res){
    res.render("ghe/themghe")
})

module.exports = router;