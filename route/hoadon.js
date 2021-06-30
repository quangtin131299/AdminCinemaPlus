const express = require("express")
const conn = require("../db/connect")
const router = express.Router()
router.use(express.static("views"))

router.get("/danhsachhoadon", function (req, res) {
	let querysoluong = `SELECT hoadon.ID,  DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay', khachhang.HoTen, hoadon.SoLuongVe, hoadon.ThanhTienVe, hoadon.TrangThai 
						from hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID`;
						
	conn.query(querysoluong, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.render("hoadon/danhsachhoadon", { danhsachhoadon: result })
		}
	})
})


module.exports = router