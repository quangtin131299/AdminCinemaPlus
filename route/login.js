const express = require("express");
// const multer = require("multer");
const conn = require("../db/connect");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(express.static("views"));

router.get("/", function(req, res){
    res.render("login/login");
})


module.exports = router;