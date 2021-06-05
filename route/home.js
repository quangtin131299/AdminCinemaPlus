const express = require("express")
const conn = require("../db/connect")


const router = express.Router()
router.use(express.static("views"))

router.get("/", function(req, res){
    res.render("index");
})

module.exports = router;