const express = require("express")
const conn = require("../db/connect")
const router = express.Router()
router.use(express.static("views"))

router.get("/danhsachve", function(req, res){
	let page = req.query.page;
	let vitribatdaulay = (page - 1)	* 5
	let querysoluong = "SELECT vedat.ID,  DATE_FORMAT(vedat.NgayDat, '%d/%m/%Y') as 'NgayDat', DATE_FORMAT(suatchieu.Gio, '%H:%i') as 'Gio', ghe.TenGhe, phim.TenPhim, khachhang.HoTen, rapphim.TenRap, phong.TenPhong, vedat.Status FROM vedat JOIN suatchieu ON vedat.ID_Suat = suatchieu.ID JOIN ghe ON ghe.ID = vedat.ID_Ghe JOIN phim ON phim.ID = vedat.ID_Phim JOIN khachhang ON khachhang.ID = vedat.ID_KhachHang JOIN rapphim ON rapphim.ID = vedat.ID_Rap JOIN phong ON phong.ID = vedat.ID_Phong";
	conn.query(querysoluong, function(err, result){
		let soluongtrang = result.length / 5
		if(err){
			console.log(err);
		}else{
			let query = `SELECT vedat.ID, DATE_FORMAT(vedat.NgayDat, '%d/%m/%Y') as 'NgayDat', DATE_FORMAT(suatchieu.Gio, '%H:%i') as 'Gio', ghe.TenGhe, phim.TenPhim, khachhang.HoTen, rapphim.TenRap, phong.TenPhong, vedat.Status FROM vedat JOIN suatchieu ON vedat.ID_Suat = suatchieu.ID JOIN ghe ON ghe.ID = vedat.ID_Ghe JOIN phim ON phim.ID = vedat.ID_Phim JOIN khachhang ON khachhang.ID = vedat.ID_KhachHang JOIN rapphim ON rapphim.ID = vedat.ID_Rap JOIN phong ON phong.ID = vedat.ID_Phong limit ${vitribatdaulay}, 5`
			conn.query(query, function(err, result){
				if(err){
					console.log(err);
				}else{
					res.render("ticker/danhsachticker", {pagerespon: page,danhsachticker: result , soluongtrang: Math.ceil(soluongtrang)})
				}
			})
		}	
	})
})


module.exports = router

