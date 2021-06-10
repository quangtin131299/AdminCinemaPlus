const express = require("express")
const conn = require("../db/connect")


const router = express.Router()
router.use(express.static("views"))

router.get("/danhsachuser", function(req, res){
	let page = req.query.page;
	let vitribatdaulay = (page - 1)	* 5
	let queryslcus = "select * from khachhang";
	conn.query(queryslcus, function(err, resultkhach){
		let ntrang = resultkhach.length / 5

		if(err){
			console.log(err);
		}else{
			let query = `SELECT khachhang.ID, khachhang.HoTen, khachhang.Email, DATE_FORMAT(khachhang.NgaySinh, '%d/%m/%Y') as 'NgaySinh', khachhang.SDT, khachhang.TaiKhoan, khachhang.MatKhau from khachhang Limit ${vitribatdaulay}, 5`;
			conn.query(query, function(err, result){	
				
				res.render("customer/danhsachcustomer", {pagerespon: page,danhsachdatauser:result ,soluongtrang: Math.ceil(ntrang)})	
			})	
		}
		
	
	})
	

})

module.exports = router