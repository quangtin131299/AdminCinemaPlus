const express = require("express")
const conn = require("../db/connect")
const router = express.Router()
router.use(express.static("views"))

router.get("/danhsachhoadon", function(req, res){
	// let page = req.query.page;
	// let vitribatdaulay = (page - 1)	* 5
	let querysoluong = "SELECT hoadon.ID, hoadon.Ngay, khachhang.HoTen, hoadon.SoLuong, hoadon.ThanhTien, hoadon.TrangThai from hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID";
	conn.query(querysoluong, function(err, result){
        console.log(err);
        res.render("hoadon/danhsachhoadon", {danhsachhoadon: result})
		// let soluongtrang = result.length / 5
		// if(err){
		// 	console.log(err);
		// }else{
		// 	// let query = `SELECT hoadon.ID, hoadon.Ngay, khachhang.HoTen, hoadon.SoLuong, hoadon.ThanhTien, hoadon.TrangThai from hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID limit ${vitribatdaulay}, 5`
		// 	conn.query(query, function(err, result){
		// 		if(err){
		// 			console.log(err);
		// 		}else{
		// 			res.render("hoadon/danhsachhoadon", {pagerespon: page,danhsachhoadon: result , soluongtrang: Math.ceil(soluongtrang)})
		// 		}
		// 	})
		// }	
	})
})


module.exports = router