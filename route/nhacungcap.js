const express = require("express");
// const multer = require("multer");
const conn = require("../db/connect");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(express.static("views"));

router.get("/danhsachnhacungcap", function(req, res){
    res.render("nhacungcap/danhsachnhacungcap");
})

router.get("/themnhacungcap", function(req, res){
    res.render("nhacungcap/themnhacungcap")
})


module.exports = router;