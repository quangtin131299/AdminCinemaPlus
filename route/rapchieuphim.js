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
			let query = `select * from rapphim limit ${vitribatdaulay}, 6`
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
            return res.json({statusCode: 0, message: 'Không thể kiểm tra trùng tên rạp chiếu'})
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

                        res.json({statusCode: 0, message: 'Thêm rạp chiếu thất bại.', newIdCinema: 0});
                    } else{
                        res.json({statusCode: 1, message: 'Thêm rạp chiếu thành công.', newIdCinema: resultRapChieuPhim.insertId});
                    }
                })
            } else {
                return res.json({statusCode: 0, message: 'Tên rạp chiếu đã tồn tại'})
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

            return res.json({statusCode: 0, message: 'Cập nhật rạp chiếu thất bại'});
        } 
            
        res.json({statusCode: 1, message: 'Cập nhật rạp chiếu thành công'});
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
            return res.json({statusCode: 0, message: 'Không thể kiểm tên phòng'});
        }else{
            if(resultNameRoom.length == 0){
                let queryLimtiRoom = `SELECT Count(*) as 'CountRoom' FROM phong JOIN rapphim ON phong.ID_Rap = rapphim.ID WHERE rapphim.ID = ?`;

                conn.query(queryLimtiRoom, [idCinema], function(errorLimitRoom, resultLimtRoom){
                    if(errorLimitRoom){
                        console.log(errorLimitRoom);
            
                       return res.json({statusCode: 0, message: 'Không thể kiểm tra giới hạn phòng'});
                    }else{
                        if(resultLimtRoom[0].CountRoom >= 4){
                            return res.json({statusCode: 0, message: 'Phòng đã đạt tới giới hạn'});
                        }else{
            
                            let queryAddRoom = `INSERT INTO phong VALUES(NULL,?,?)`;
            
                            conn.query(queryAddRoom, [nameRoom, idCinema], function(error, resultAddRoom){
                                if(error){
                                    console.log(error);
                        
                                    return res.json({statusCode: 0, message: 'Thêm phòng thất bại'})
                                }else{ 
                                    if(resultAddRoom.insertId != 0){
                                        let queryInsertRoom = `INSERT INTO ghe VALUES (NULL,'A1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'A2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'A3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'A4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'A5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'A6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'B1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'B2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'B3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'B4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'B5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'B6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C7','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'C8','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D7','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'D8','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E7','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'E8','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F7','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'F8','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G7','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'G8','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H7','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'H8','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I1','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I2','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I3','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I4','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I5','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I6','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I7','${resultAddRoom.insertId}','Trống')
                                                                                    ,(NULL,'I8','${resultAddRoom.insertId}','Trống')`;
                        
                                        conn.query(queryInsertRoom,  function(errorAddSeat){
                                            if(errorAddSeat){
                                                console.log(errorAddSeat);
                        
                                                return res.json({statusCode: 0, message: 'Thêm ghế thất bại', Id_Room: resultAddRoom.insertId})
                                            }
                        
                                            res.json({statusCode: 1, message: 'Thêm phòng thành công', Id_Room: resultAddRoom.insertId});
                                        })
                                    }
                                   
                                }
                            })
                        
                        }
                    }
                });
            
            }else{
                res.json({statusCode: 0, message: 'Tên phòng bị trùng '});
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
            return res.json({statusCode: 0, message: 'Cập nhật hình ảnh thất bại'});
        }

        res.json({statusCode: 1, message: 'Cập nhật hình ảnh thành công'});
    })                            
})


module.exports = router