const express = require("express")
const conn = require("../db/connect")
const router = express.Router()
router.use(express.static("views"))

router.get("/danhsachve", function (req, res) {
	let currentMonth = new Date().getMonth() + 1;
	let page = req.query.page && req.query.page != 0 ? req.query.page : 1;
	let startPosition = (page - 1) * 10
	
	let queryTicker = `SELECT * FROM vedat WHERE MONTH(vedat.NgayDat) = ?`;

	conn.query(queryTicker, [currentMonth] ,function (error, resultTicker) {
		let numberPage = resultTicker.length / 10;

		let querysoluong = `SELECT vedat.ID
								, DATE_FORMAT(vedat.NgayDat, '%d/%m/%Y') as 'NgayDat'
								, DATE_FORMAT(suatchieu.Gio, '%H:%i') as 'Gio'
								, ghe.TenGhe
								, phim.TenPhim
								, khachhang.HoTen
								, rapphim.TenRap
								, phong.TenPhong
								, vedat.TrangThai
						FROM vedat JOIN suatchieu ON vedat.ID_Suat = suatchieu.ID JOIN ghe ON ghe.ID = vedat.ID_Ghe
									JOIN phim ON phim.ID = vedat.ID_Phim 
									JOIN khachhang ON khachhang.ID = vedat.ID_KhachHang
									JOIN rapphim ON rapphim.ID = vedat.ID_Rap 
									JOIN phong ON phong.ID = vedat.ID_Phong
						WHERE MONTH(vedat.NgayDat) = ? 
						ORDER BY vedat.NgayDat DESC LIMIT ?, 10`;

		conn.query(querysoluong, [currentMonth,startPosition] ,function (err, result) {
			if (err) {
				console.log(err);

				res.render("ticker/danhsachticker", { danhsachticker: [] , numberPage: Math.ceil(numberPage), pageCurrent: page});
			} else {
				res.render("ticker/danhsachticker", { danhsachticker: result, numberPage: Math.ceil(numberPage), pageCurrent: page});
			}
		})
	})
})


module.exports = router

