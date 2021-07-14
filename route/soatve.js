const express = require("express")
const conn = require("../db/connect")
const router = express.Router()
router.use(express.static("views"))

router.get("/hienthisoatve", function(req, res){
	res.render("soatve/hienthisoatve");
})


module.exports = router