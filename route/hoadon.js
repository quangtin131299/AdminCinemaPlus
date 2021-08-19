const express = require("express")
const conn = require("../db/connect")
const router = express.Router()
router.use(express.static("views"))

router.get("/danhsachhoadon", function (req, res) {
	let page = req.query.page ? req.query.page : 1;
	let date = new Date();

	date.setMonth(date.getMonth() + 1);

	let currentMonth = date.getMonth();
	let startPosition = (page - 1) * 10;
	let queryCountBill = `SELECT hoadon.ID,  DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay', khachhang.HoTen, hoadon.SoLuongVe, hoadon.ThanhTienVe, hoadon.TrangThai 
						  FROM hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID
						  WHERE Month(hoadon.Ngay) = ?`;

	conn.query(queryCountBill, [currentMonth], function (err, resultCountBill) {
		if (err) {
			console.log(err);
		} else {
			let numberPage = resultCountBill.length / 10;

			let queryBill = `SELECT hoadon.ID,  DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay', khachhang.HoTen, hoadon.SoLuongVe, hoadon.ThanhTienVe, hoadon.TrangThai 
							 FROM hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID
							 WHERE Month(hoadon.Ngay) = ? ORDER BY hoadon.Ngay DESC LIMIT ?, 10`;

			conn.query(queryBill, [currentMonth, startPosition], function (error, resultBill) {
				if (error) {
					console.log(error);

					res.render("hoadon/danhsachhoadon", { danhsachhoadon: [], numberPage: 0, currentPage: 0 })
				} else {
					res.render("hoadon/danhsachhoadon", { danhsachhoadon: resultBill, numberPage: numberPage, currentPage: page })
				}
			})
		}
	})
})

router.get("/chitiethoadon", function (req, res) {
	let idhoadon = req.query.idhoadon;

	let query = `SELECT hoadon.ID as 'Id_HoaDon'
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
						, hoadon_bapnuoc.*
						, bapnuoc.*
				FROM hoadon JOIN khachhang ON hoadon.ID_KhachHang = khachhang.ID
							JOIN vedat ON hoadon.ID = vedat.ID_HoaDon
							JOIN ghe ON vedat.ID_Ghe = ghe.ID
							JOIN phim ON vedat.ID_Phim = phim.ID
							JOIN rapphim ON vedat.ID_Rap = rapphim.ID
							JOIN phong ON vedat.ID_Phong = phong.ID
							JOIN suatchieu ON vedat.ID_Suat = suatchieu.ID
							LEFT JOIN hoadon_bapnuoc on hoadon.ID = hoadon_bapnuoc.ID_HoaDon
							LEFT join bapnuoc on bapnuoc.ID = hoadon_bapnuoc.ID_BapNuoc
				WHERE hoadon.ID = ?`;
	conn.query(query, [idhoadon], function (err, result) {
		if (err) {
			console.log(err);

			res.redirect("/hoadon/danhsachhoadon")
		} else {
			let billResult = [];
			let seats = [];
			let combos = [];
			let countBill = result.length;

			for (let i = 0; i < countBill; i++) {
				seats.push({
					idSeat: result[i].ID_Ghe,
					seatName: result[i].TenGhe,
				})

			}

			let nameComboApproved = '';
			let totalAmountPopCorn = 0;

			for (let i = 0; i < countBill; i++) {
				if (result[i].TenCombo != null && nameComboApproved != result[i].TenCombo) {
					combos.push({
						popCornName: result[i].TenCombo,
						count: result[i].SoLuong,
						unitPrice: result[i].DonGia,
						amount: result[i].ThanhTien,
						img: result[i].Hinh
					})

					totalAmountPopCorn += result[i].ThanhTien;

					nameComboApproved = result[i].TenCombo;
				}
			}


			billResult.push({
				ID: result[0].Id_HoaDon,
				Ngay: result[0].Ngay,
				ThanhTienVe: result[0].ThanhTienVe,
				HoTen: result[0].HoTen,
				TenPhim: result[0].TenPhim,
				ThoiGian: result[0].ThoiGian,
				TenRap: result[0].TenRap,
				TenPhong: result[0].TenPhong,
				Gio: result[0].Gio,
				combos: combos,
				seats: seats,
				totalAmoutPopcorn: totalAmountPopCorn
			})

			res.render("hoadon/chitiethoadon", { hoadon: billResult[0] });
		}
	})
});

router.get("/searchbill",function(req, res){
	let page = req.query.page ? req.query.page : 1;
	let startPosition = (page - 1) * 10;
	let date = new Date();

	date.setMonth(date.getMonth() + 1);

	let fromDate = req.query.fromDate;
	let toDate = req.query.toDate;
	let keyWord = req.query.keyWord;	

	if(!fromDate || !toDate){
		let queryMonthLength = `SELECT hoadon.ID,  DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay', khachhang.HoTen, hoadon.SoLuongVe, hoadon.ThanhTienVe, hoadon.TrangThai 
						FROM hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID
						WHERE Month(hoadon.Ngay) = ? AND khachhang.HoTen like ?`;
		conn.query(queryMonthLength, [date.getMonth(), `%${keyWord}%`], function(error, resultBill){
			if(error){
				console.log(error);

				res.json({statusCode: 0, message: 'Fail', resultBill: []});
			}else{
				let numberPage = resultBill.length / 10;
				let queryMonth = `SELECT hoadon.ID,  DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay', khachhang.HoTen, hoadon.SoLuongVe, hoadon.ThanhTienVe, hoadon.TrangThai 
				   				  FROM hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID
								  WHERE Month(hoadon.Ngay) = ? AND khachhang.HoTen like ? LIMIT ?, 10`;

				conn.query(queryMonth, [date.getMonth(), `%${keyWord}%`, startPosition], function(errorBill, resultBill){
					if(errorBill){
						console.log(errorBill);

						res.json({statusCode: 0, message: 'Fail', resultBill: [], currentPage: 0, numberPage:0});
					}else{
						res.json({statusCode: 1, message: 'Success', resultBill: resultBill, currentPage: page, numberPage: Math.ceil(numberPage)});
					}
				});
			
				
			}
		})
	}else{
		let queryDateLength = `SELECT hoadon.ID,  DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay', khachhang.HoTen, hoadon.SoLuongVe, hoadon.ThanhTienVe, hoadon.TrangThai 
		   				  FROM hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID
						  WHERE hoadon.Ngay BETWEEN ? AND ? AND khachhang.HoTen like ?`;

		conn.query(queryDateLength, [fromDate, toDate, `%${keyWord}%`], function (error, resultBill) {
			if (error) {
				console.log(error);

				res.json({ statusCode: 0, message: 'Fail', resultBill: [] });
			} else {
				let numberPage = resultBill.length / 10;
				let queryDate = `SELECT hoadon.ID,  DATE_FORMAT(hoadon.Ngay, '%d/%m/%Y') as 'Ngay', khachhang.HoTen, hoadon.SoLuongVe, hoadon.ThanhTienVe, hoadon.TrangThai 
								 FROM hoadon join khachhang on hoadon.ID_KhachHang = khachhang.ID
								 WHERE hoadon.Ngay BETWEEN ? AND ? AND khachhang.HoTen like ? LIMIT ?, 10`;

				conn.query(queryDate, [fromDate, toDate, `%${keyWord}%`, startPosition], function(errorBill, resultBill){
					if(errorBill){
						console.log(errorBill);

						res.json({statusCode: 0, message: 'Fail', resultBill: [], currentPage: 0, numberPage: 0});
					}else{
						res.json({statusCode: 1, message: 'Success', resultBill: resultBill, currentPage: page, numberPage: Math.ceil(numberPage)});
					}
				})			
			}
		})
	}
})



module.exports = router