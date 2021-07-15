const express = require("express")
const conn = require("../db/connect")
const router = express.Router()
router.use(express.static("views"))

router.get("/hienthisoatve", function(req, res){
	res.render("soatve/hienthisoatve");
})

router.post("/updateStatus", function(req, res){
	let id = req.body.text;
	let sqlquery = `update vedat join hoadon on vedat.ID_HoaDon = hoadon.ID
					set vedat.TrangThai ='Đã nhận vé'
					where hoadon.ID =?`;
	conn.query(
        sqlquery,[id],function (err, result) {
            if (err) {
              res.send(err);
            } else {
              res.render("soatve/updateStatus");
            }
        }
    );
})

module.exports = router