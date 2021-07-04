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

router.get("/chitiethoadon", function(req, res){
	let idhoadon = req.query.idhoadon;

	let query = `SELECT hoadon.ID
						, DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay'
						, hoadon.ThanhTienVe
						, khachhang.ID
						, khachhang.HoTen
						, vedat.ID_Ghe
						, ghe.TenGhe
						, phim.TenPhim
						, phim.ThoiGian
						, rapphim.TenRap
						, phong.TenPhong
						, suatchieu.Gio
				FROM hoadon JOIN khachhang ON hoadon.ID_KhachHang = khachhang.ID
							JOIN vedat ON hoadon.ID = vedat.ID_HoaDon
							JOIN ghe ON vedat.ID_Ghe = ghe.ID
							JOIN phim ON vedat.ID_Phim = phim.ID
							JOIN rapphim ON vedat.ID_Rap = rapphim.ID
							JOIN phong ON vedat.ID_Phong = phong.ID
							JOIN suatchieu ON vedat.ID_Suat = suatchieu.ID
				WHERE hoadon.ID = ?`;
	conn.query(query, [idhoadon], function(err, result){
		if (err) {
			console.log(err);
			res.redirect("/hoadon/danhsachhoadon")
		} else {
			res.render("hoadon/chitiethoadon", { hoadon: result[0]});
		}
	})
})


module.exports = router