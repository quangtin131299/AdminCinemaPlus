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
	conn.query(query, [idhoadon], function(err, result){
		if (err) {
			console.log(err);

			res.redirect("/hoadon/danhsachhoadon")
		} else {
			let billResult = [];
			let seats = [];
			let combos = [];
			let countBill = result.length;
			
			for(let i = 0; i < countBill; i++){
				seats.push({
					idSeat: result[i].ID_Ghe,
					seatName: result[i].TenGhe, 
				})
				
			}

			let nameComboApproved = '';
			let totalAmountPopCorn = 0;

			for(let i = 0; i < countBill; i++){
				if(nameComboApproved != result[i].TenCombo){
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
				ID: result[0].ID,
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

			res.render("hoadon/chitiethoadon", { hoadon: billResult[0]});
		}
	})
})


module.exports = router