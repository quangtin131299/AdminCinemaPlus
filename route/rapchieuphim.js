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
	let vitribatdaulay = (page - 1)	* 5;
	
	conn.query(queryslrap, function(err, resul){
		if(err){
			console.log(err);
		}else{
			let ntrang = resul.length / 5
			let query = `select * from rapphim limit ${vitribatdaulay}, 5`
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


    if(req.query.mess &&  req.query.mess == 1){
        messageEdit = "Sửa thành công";
    }else if(req.query.mess &&  req.query.mess == 0){
        messageEdit = "Sửa thất bại";
    }

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
                        , rapphim.Hinh = ?
                        , rapphim.DiaChi = ?
                        , rapphim.ViDo = ?
                        , rapphim.KinhDo = ?
                    WHERE rapphim.ID = ?`;
    
    conn.query(sqlquery,[cinemaName, '', cinemaAddress, viDo, kinhDo, maRap], function(err){
        if(err){
            console.log(err);

            return res.json({statusCode: 0, message: 'Cập nhật rạp chiếu thất bại'});
        } 
            
        res.json({statusCode: 1, message: 'Cập nhật rạp chiếu thành công'});
    })
});


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