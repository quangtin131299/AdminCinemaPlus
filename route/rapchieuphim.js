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
    let messAddCinema = '';

    // if(req.query.mess && req.query.mess == 1){
    //     messAddCinema = 'Thêm thành công';
    // } else if (req.query.mess && req.query == -1){
    //     messAddCinema = 'Thêm thất bại';
    // }

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
    let theaterName = req.body.txtTheaterName;
    let imgCinema = fileNameImageCinema && fileNameImageCinema != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/Cinema/${fileNameImageCinema}`: '' ;
    let cinemaAddress = req.body.txtCinemaAddress;
	let viDo = req.body.txtViDo;
	let kinhDo = req.body.txtKinhDo;

    let queryInsert = `INSERT INTO rapphim VALUES (NULL,?,?,?,?,?)`;

    conn.query(queryInsert, [theaterName
                            ,imgCinema
                            ,cinemaAddress
                            ,viDo
                            ,kinhDo], function(errorRapChieuPhim, resultRapChieuPhim){
        if(errorRapChieuPhim){
            console.log(errorRapChieuPhim);

            res.render("rapchieu/themrapchieu", {
                messNotify: 'Thêm thất bại'
            });
        } else{
            res.render("rapchieu/themrapchieu", {
                messNotify: 'Thêm thành công'
            });
        }
    })
})



router.get("/suarapchieu", function(req, res){
    let idCinema = req.query.idCinema;
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
            console.log(fileImageCinemaUrlOld);
            res.render("rapchieu/suarapchieu", {rapphim: result[0]});
        }
    })
});

router.post("/suarapchieu", uploadImage, function(req, res){
    let maRap = req.body.maRap;
    let cinemaName = req.body.txtTheaterName;
    let imgCinema = fileNameImageCinema && fileNameImageCinema != '' ? `${req.protocol}://${(req.hostname =='localhost' ? req.hostname + ':3000' : req.hostname )}/img/Cinema/${fileNameImageCinema}`:  fileImageCinemaUrlOld;
    let cinemaAddress = req.body.txtCinemaAddress;
    let viDo = req.body.txtViDo;
    let kinhDo = req.body.txtKinhDo;
    console.log(maRap);
    console.log(cinemaAddress);
    console.log(imgCinema);
    console.log(viDo);
    console.log(kinhDo);
    let sqlquery = `UPDATE rapphim
                        SET rapphim.TenRap = ?, rapphim.Hinh = ?, rapphim.DiaChi = ?
                            , rapphim.ViDo = ?, rapphim.KinhDo = ?
                        WHERE rapphim.ID = ?`;
    
    conn.query(sqlquery,[cinemaName, imgCinema, cinemaAddress, viDo, kinhDo, maRap], function(err, result){
        if(err){
            console.log(err);
            res.send(err);
        } else {
            res.redirect("/rapchieu/danhsachrapchieu?page=1")
        }
    })
});


module.exports = router