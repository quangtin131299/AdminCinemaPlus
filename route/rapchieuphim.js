const express = require("express")
const conn = require("../db/connect")
const bodyParser = require("body-parser");
const multer = require("multer");
const { render } = require("pug");
const router = express.Router();

router.use(express.static("views"))
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let fileNameImageCinema = '';
let fileImageCinemaUrlOld = '';

var storageImageCinema = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.fieldname == 'imgCinema'){
        cb(null, "views/img/Cinema");
      }
      
    },
    filename: function (req, file, cb) {
      if(file.fieldname == 'imgCinema'){
        fileNameImageCinema =  file.originalname ? file.originalname : '';
      }
      cb(null, file.originalname);
    },
});
  
const uploadImageCinema = multer({ storage: storageImageCinema });


router.get("/danhsachrapchieu", function(req, res){
	let queryslrap = `SELECT * FROM rapphim`
	let page = req.query.page;
	let vitribatdaulay = (page - 1)	* 6;
	
	conn.query(queryslrap, function(err, resul){
		if(err){
			console.log(err);
		}else{
			let ntrang = resul.length / 6
			let query = `SELECT * FROM rapphim LIMIT ${vitribatdaulay}, 6`
			conn.query(query, function(err, result){
				if(err){
					console.log(err);
				}else{
					res.render("rapchieu/danhsachrap", {danhsachrapchieu: result, pagerespon: page,soluongtrang: Math.ceil(ntrang)})
				}
			})
		}
	})
})

router.get("/themrapchieu", function(req, res){

    let queryRapChieuPhim = `select * from rapphim`;

    conn.query(queryRapChieuPhim, function(errorRapChieuPhim, resultRapChieuPhim){
        if(errorRapChieuPhim){
            console.log(errorRapChieuPhim);

            res.render("rapchieu/themrapchieu",{
                rapchieuphim: [],
               
            });
        } else{
            res.render("rapchieu/themrapchieu",{
                rapchieuphim: resultRapChieuPhim,
                
            });
        }
    })
});


let uploadImage = uploadImageCinema.fields([{ name: 'imgCinema', maxCount: 1 }])

router.post('/themrapchieu',uploadImage, function(req,res){
    let theaterName = req.body.nameCinema;
    let cinemaAddress = req.body.address;
	let viDo = req.body.lat;
	let kinhDo = req.body.lng;

    let queryDuplicateNameCinema = `SELECT * FROM rapphim where rapphim.TenRap = ? `;
    
    conn.query(queryDuplicateNameCinema, [theaterName], function(errorDuplicateNameCinema, resultNameCinema){
        if(errorDuplicateNameCinema) {
            console.log(errorDuplicateNameCinema);
            return res.json({statusCode: 0, message: 'Kh??ng th??? ki???m tra tr??ng t??n r???p chi???u'})
        } else {
            if(resultNameCinema.length == 0){
                let queryInsert = `INSERT INTO rapphim VALUES (NULL,?,?,?,?,?)`;

                conn.query(queryInsert, [theaterName
                            ,''
                            ,cinemaAddress
                            ,viDo
                            ,kinhDo], function(errorRapChieuPhim, resultRapChieuPhim){
                    if(errorRapChieuPhim){
                        console.log(errorRapChieuPhim);

                        res.json({statusCode: 0, message: 'Th??m r???p chi???u th???t b???i.', newIdCinema: 0});
                    } else{
                        res.json({statusCode: 1, message: 'Th??m r???p chi???u th??nh c??ng.', newIdCinema: resultRapChieuPhim.insertId});
                    }
                })
            } else {
                return res.json({statusCode: 0, message: 'T??n r???p chi???u ???? t???n t???i'})
            }
        }
    })
})



router.get("/suarapchieu", function(req, res){
    let idCinema = req.query.idCinema;
    let messageEdit = '';
    let query =`SELECT rapphim.ID
                        , rapphim.TenRap
                        , rapphim.Hinh
                        , rapphim.DiaChi
                        , rapphim.ViDo
                        , rapphim.KinhDo
                FROM rapphim WHERE rapphim.ID = ?`;

    conn.query(query,[idCinema] ,function (err, result){
        if(err) {
            console.log(err);
        } else {
            fileImageCinemaUrlOld = result[0].Hinh;
            res.render("rapchieu/suarapchieu", {rapphim: result[0] , messNotify: messageEdit});
        }
    })
});

router.post("/suarapchieu", uploadImage, function(req, res){
    let maRap = req.body.idCinema;
    let cinemaName = req.body.nameCinema;
    let cinemaAddress = req.body.address;
    let viDo = req.body.lat;
    let kinhDo = req.body.lng;
    let sqlquery = `UPDATE rapphim
                    SET rapphim.TenRap = ?
                        , rapphim.DiaChi = ?
                        , rapphim.ViDo = ?
                        , rapphim.KinhDo = ?
                    WHERE rapphim.ID = ?`;
    
    conn.query(sqlquery,[cinemaName, cinemaAddress, viDo, kinhDo, maRap], function(err){
        if(err){
            console.log(err);

            return res.json({statusCode: 0, message: 'C???p nh???t r???p chi???u th???t b???i'});
        } 
            
        res.json({statusCode: 1, message: 'C???p nh???t r???p chi???u th??nh c??ng'});
    })
});

router.get("/chitietrapchieu", function (req, res) {
    let idCinema = req.query.idCinema;
  
    let query = `SELECT rapphim.ID
                        , rapphim.TenRap
                        , rapphim.Hinh
                        , rapphim.DiaChi
                        , rapphim.KinhDo
                        , rapphim.ViDo
                        , phong.ID as 'ID_Phong'
                        , phong.TenPhong
                 FROM rapphim LEFT JOIN phong ON rapphim.ID = phong.ID_Rap
                 WHERE rapphim.ID = ?`;
    conn.query(query, [idCinema], function (err, result) {
      if (err) {
        console.log(err);
  
        res.redirect("/rapchieu/danhsachrap?page=1")
      } else {
          let resultCinema = [];
          let nameCinema = '';
          let rooms =[];
          let countCinema = result.length;
        
          for (let i = 0; i < countCinema; i++) {
              for (let j = i; j < countCinema; j++) {
                  if (result[i].TenRap == result[j].TenRap && result[j].ID_Phong != null) {              
                    rooms.push({
                        id: result[j].ID_Phong,
                        nameRoom: result[j].TenPhong
                    })
                  }
              }

              nameCinema = result[i].TenRap;

              resultCinema.push({
                ID: result[i].ID,
                TenRap: result[i].TenRap,
                DiaChi: result[i].DiaChi,
                Hinh:  result[i].Hinh,
                KinhDo:result[i].KinhDo,
                ViDo: result[i].ViDo,
                rooms : rooms
              })
              rooms = [];
              
          }
        
        res.render("rapchieu/chitietrapchieu", { cinema: resultCinema[0] });
      }
    });
});

router.post("/themphong", function(req, res){
    let nameRoom = req.body.nameRoom;
    let idCinema = req.body.idCinema;

    let queryNameRoom = `SELECT * FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID WHERE phong.TenPhong = ? AND rapphim.ID = ?`;

    conn.query(queryNameRoom, [nameRoom, idCinema] ,function(errorNameRoom, resultNameRoom ){
        if(errorNameRoom){
            return res.json({statusCode: 0, message: 'Kh??ng th??? ki???m t??n ph??ng'});
        }else{
            if(resultNameRoom.length == 0){
                let queryLimtiRoom = `SELECT Count(*) as 'CountRoom' FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID WHERE rapphim.ID = ?`;

                conn.query(queryLimtiRoom, [idCinema], function(errorLimitRoom, resultLimtRoom){
                    if(errorLimitRoom){
                        console.log(errorLimitRoom);
            
                       return res.json({statusCode: 0, message: 'Kh??ng th??? ki???m tra gi???i h???n ph??ng'});
                    }else{
                        if(resultLimtRoom[0].CountRoom >= 4){
                            return res.json({statusCode: 0, message: 'Ph??ng ???? ?????t t???i gi???i h???n'});
                        }else{
            
                            let queryAddRoom = `INSERT INTO phong VALUES(NULL,?,?)`;
            
                            conn.query(queryAddRoom, [nameRoom, idCinema], function(error, resultAddRoom){
                                if(error){
                                    console.log(error);
                        
                                    return res.json({statusCode: 0, message: 'Th??m ph??ng th???t b???i'})
                                }else{ 
                                    if(resultAddRoom.insertId != 0){
                                        let queryInsertRoom = `INSERT INTO ghe VALUES (NULL,'A1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'A2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'A3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'A4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'A5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'A6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'B1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'B2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'B3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'B4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'B5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'B6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C7','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'C8','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D7','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'D8','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E7','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'E8','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F7','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'F8','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G7','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'G8','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H7','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'H8','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I1','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I2','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I3','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I4','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I5','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I6','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I7','${resultAddRoom.insertId}','Tr???ng')
                                                                                    ,(NULL,'I8','${resultAddRoom.insertId}','Tr???ng')`;
                        
                                        conn.query(queryInsertRoom,  function(errorAddSeat){
                                            if(errorAddSeat){
                                                console.log(errorAddSeat);
                        
                                                return res.json({statusCode: 0, message: 'Th??m gh??? th???t b???i', Id_Room: resultAddRoom.insertId})
                                            }
                        
                                            res.json({statusCode: 1, message: 'Th??m ph??ng th??nh c??ng', Id_Room: resultAddRoom.insertId});
                                        })
                                    }
                                   
                                }
                            })
                        
                        }
                    }
                });
            
            }else{
                res.json({statusCode: 0, message: 'T??n ph??ng b??? tr??ng '});
            }
        }
    })   
})



router.put("/updateImage",function(req, res){
    let idCinema = req.body.idCinema;
    let urlImageCinema = req.body.urlImage;

    let queryUpdateImage = `UPDATE rapphim
                            SET rapphim.Hinh = ?
                            WHERE rapphim.ID = ? `;

    conn.query(queryUpdateImage, [urlImageCinema,idCinema],function(errorUpdate){
        if(errorUpdate){
            return res.json({statusCode: 0, message: 'C???p nh???t h??nh ???nh th???t b???i'});
        }

        res.json({statusCode: 1, message: 'C???p nh???t h??nh ???nh th??nh c??ng'});
    })                            
})


router.get("/thongkerap", function(req, res){
    let idCinema = req.query.id;

    let query = `SELECT * FROM rapphim WHERE rapphim.ID = ?`;

    conn.query(query, [idCinema], function(error, result){
        if(error){
            console.log(error);

            res.render('rapchieu/statistical', {cinema: null});
        }else{
            res.render('rapchieu/statistical', {cinema: result[0]});
        }
    })
})

router.get("/tinhtoanthongke", function(req, res){
    let idCinema = req.query.idCinema;

    let query = `SELECT  Month(hoadon.Ngay) as 'Thang'
                        , COALESCE(SUM(hoadon.ThanhTienVe + COALESCE(hoadon_bapnuoc.ThanhTien, 0)), 0) as 'DoanhThu' 
                FROM rapphim JOIN vedat on vedat.ID_Rap = rapphim.ID
                             JOIN hoadon ON vedat.ID_HoaDon = hoadon.ID
                             LEFT JOIN hoadon_bapnuoc on hoadon.ID = hoadon_bapnuoc.ID_BapNuoc
                WHERE rapphim.ID = ? AND Month(hoadon.Ngay) between 1 and 12 GROUP BY Month(hoadon.Ngay)`;

    conn.query(query, [idCinema],function(error, result){
        if(error){
            console.log(error);

            res.json({statusCode: 0, message: 'l???y d??? li???u th???t b???i', turnover: null});
        }else{

            res.json({statusCode: 1, message: 'l???y d??? li???u th??nh c??ng', turnover: result});
        }
    });

}) 


router.get('/searchcinema', function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let startPosition = (page - 1) * 6;
    let keyWord = req.query.keyWord;
    let querySearchCinemaCount = `SELECT * FROM rapphim WHERE rapphim.TenRap like ? OR rapphim.DiaChi like ?`;

    conn.query(querySearchCinemaCount, [`%${keyWord}%`, `%${keyWord}%`],function (error, resultCountCinema) {
        if (error) {
            console.log(error);
        } else {
            let numberPage = resultCountCinema.length / 6;
            let querySearchCinema = `SELECT * FROM rapphim WHERE rapphim.TenRap LIKE ? OR rapphim.DiaChi LIKE ? LIMIT ?,6`;

            conn.query(querySearchCinema, [`%${keyWord}%`, `%${keyWord}%`, startPosition], function (error, resultCinema) {
                if (error) {
                    console.log(error);

                    res.json({ statusCode: 0, message: 'Fail', resultCinema: [], currentPage: 0,  numberPage: 0 })
                } else {
                    res.json({ statusCode: 1, message: 'Success', resultCinema: resultCinema, currentPage: page,  numberPage: Math.ceil(numberPage)});
                }
            })

        }
    });

})


module.exports = router