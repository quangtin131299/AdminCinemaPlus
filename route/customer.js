const express = require("express")
const conn = require("../db/connect")


const router = express.Router()
router.use(express.static("views"))

router.get("/danhsachuser", function(req, res){
	let page = req.query.page;
	let vitribatdaulay = (page - 1)	* 10
	let queryslcus = "select * from khachhang";
	conn.query(queryslcus, function(err, resultkhach){
		let countCustomer = resultkhach.length
		let ntrang = countCustomer / 10

		if(err){
			console.log(err);
		}else{
			let query = `SELECT khachhang.ID
								, khachhang.HoTen
								, khachhang.Email
								, DATE_FORMAT(khachhang.NgaySinh, '%d/%m/%Y') as 'NgaySinh'
								, khachhang.SDT
								, khachhang.TaiKhoan
								, khachhang.MatKhau 
						FROM khachhang LIMIT ${vitribatdaulay}, 10`;
			conn.query(query, function(err, result){	
				if(err){
					console.log(err);
				}else{
					res.render("customer/danhsachcustomer", {pagerespon: page,danhsachdatauser:result ,soluongtrang: Math.ceil(ntrang), countCustomerUse: countCustomer})	
				}
				
			})	
		}
		
	
	})
	

})

module.exports = router