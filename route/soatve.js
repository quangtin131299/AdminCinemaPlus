const express = require("express");
const conn = require("../db/connect");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.static("views"));


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/hienthisoatve", function (req, res) {
  res.render("soatve/hienthisoatve");
})

router.post("/updateStatus", function (req, res) {
  let id = req.body.id;
  let sqlquery = `UPDATE vedat JOIN hoadon on vedat.ID_HoaDon = hoadon.ID
                  SET vedat.TrangThai = 'Đã nhận vé'
                  WHERE hoadon.ID = ?`;
  conn.query(
    sqlquery, [id], function (err, result) {
      if (err) {
        console.log(err);
        
        res.json({message: 'Soát vé thất bại', statusCode: 0});
      } else {
        res.json({message: 'Soát vé thành công', statusCode: 1});
      }
    }
  );
})

module.exports = router