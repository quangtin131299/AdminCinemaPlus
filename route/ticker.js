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

router.get("/searchticker",function(req, res){
	let page = req.query.page ? req.query.page : 1;
	let startPosition = (page - 1) * 10;
	let keyWordNameCustomer = req.query.keyWord;
	let fromDate = req.query.fromDate;
	let toDate = req.query.toDate;
	let nameMovie = req.query.nameMovie;
	let currentDate = new Date();

	currentDate.setMonth(currentDate.getMonth()  + 1);

	if(fromDate && fromDate == ''){		
		fromDate = `${currentDate.getFullYear().toString()}-${currentDate.getMonth().toString().padStart(2,'0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
	}

	if(toDate && toDate == ''){
		toDate = `${currentDate.getFullYear().toString()}-${currentDate.getMonth().toString().padStart(2,'0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
	}
	
	if(fromDate && toDate){
		let querySearchDate = `SELECT vedat.ID
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
							WHERE vedat.NgayDat BETWEEN ? AND ? AND khachhang.HoTen like ?
														AND phim.TenPhim like ?
							ORDER BY vedat.NgayDat DESC`;
														
		conn.query(querySearchDate, [fromDate, toDate, `%${keyWordNameCustomer}%`, `${nameMovie}%`], function(error, resultTicker){
			if(error){
				console.log(error);

				res.json({statusCode: 0, message: 'Fail',resultTicker: []});
			}else{
				let numberPage = resultTicker.length / 10;

				let querySearchDatePage = `SELECT vedat.ID
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
							WHERE vedat.NgayDat BETWEEN ? AND ? AND khachhang.HoTen like ?
														AND phim.TenPhim like ?
							ORDER BY vedat.NgayDat DESC LIMIT ? , 10`;

				conn.query(querySearchDatePage, [fromDate, toDate, `%${keyWordNameCustomer}%`, `${nameMovie}%`,startPosition], function(errorPage, resultPageTicker){
					if(errorPage){
						console.log(errorPage);

						res.json({statusCode: 0, message: 'Fail',resultTicker: [] , numberPage: 0, currentPage: 0});
					}else{
						res.json({statusCode: 1, message: 'Success',resultTicker: resultPageTicker , numberPage: Math.ceil(numberPage), currentPage: page});
					}
				})

				
			}
		});

	}else{
		let querySearchMonthCount = `SELECT vedat.ID
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
								WHERE MONTH(vedat.NgayDat) = ? AND khachhang.HoTen like ?
															AND phim.TenPhim like ?
								ORDER BY vedat.NgayDat DESC`;
		
		conn.query(querySearchMonthCount,[currentDate.getMonth() , `%${keyWordNameCustomer}%`, `${nameMovie}%`], function(error, resultCount){
			let numberPage = resultCount.length / 10;

			let querySearchMonth = `SELECT vedat.ID
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
								WHERE MONTH(vedat.NgayDat) = ? AND khachhang.HoTen like ?
															AND phim.TenPhim like ?
								ORDER BY vedat.NgayDat DESC LIMIT ? , 10`

		
			conn.query(querySearchMonth, [currentDate.getMonth() , `%${keyWordNameCustomer}%`, `${nameMovie}%`, startPosition], function(error, resultTicker){
				if(error){
					console.log(error);

					res.json({statusCode: 0, message: 'Fail',resultTicker: [] , numberPage: 0, currentPage: 0});
				}else{
					res.json({statusCode: 1, message: 'Success',resultTicker: resultTicker , numberPage: Math.ceil(numberPage), currentPage: page});
				}
			});
		})
		
		

	}

})	
	
router.get('/loadmovie',function(req, res){
	let queryMovie = `SELECT phim.ID ,  phim.TenPhim FROM phim WHERE phim.isDelete = 0`;

	conn.query(queryMovie, function(error, resultMovie){
		if(error){
			console.log(error);
			
			res.json({status: 0, message: 'Fail', ressultMovie: []});
		}else{
			res.json({status: 1, message: 'Success', ressultMovie: resultMovie});
		}
	})
})

router.get('/detailticker', function(req, res){
	let idTicker = req.query.idTicker;

	let queryTicker = `SELECT vedat.ID
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
						WHERE vedat.ID = ?`
		
	conn.query(queryTicker, [idTicker], function(error, resultTicker){
		if(error){
			console.log(error);

			res.render('ticker/detailticker', {ticker: null});
		}else{
			res.render('ticker/detailticker', {ticker: resultTicker[0]});
		}
	})
})
	


module.exports = router

